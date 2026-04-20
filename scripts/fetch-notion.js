/**
 * Notion Data Fetcher
 *
 * This script fetches blog posts from Notion database and generates a static JSON file.
 * Run this during build process to avoid exposing API keys in client-side code.
 *
 * Usage: bun run scripts/fetch-notion.js
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables from .env file (for local development)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "..", ".env") });

// Get environment variables
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY) {
  console.error("❌ NOTION_API_KEY environment variable is required");
  process.exit(1);
}

if (!NOTION_DATABASE_ID) {
  console.error("❌ NOTION_DATABASE_ID environment variable is required");
  process.exit(1);
}

const NOTION_VERSION = "2022-06-28";

// Generic fetch wrapper for Notion API
async function notionFetch(endpoint, options = {}) {
  const url = `https://api.notion.com/v1/${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Notion API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
}

// Parse Notion rich text to plain string
function parseRichText(richText) {
  return richText?.map((item) => item.plain_text).join("") || "";
}

// Convert Notion rich text to Markdown with annotations
function formatRichText(richText) {
  if (!richText) return "";
  return richText.map((item) => {
    let text = item.plain_text;
    if (!text) return "";

    if (item.href) {
      text = `[${text}](${item.href})`;
    }

    if (item.annotations) {
      if (item.annotations.code) text = `\`${text}\``;
      if (item.annotations.bold) text = `**${text}**`;
      if (item.annotations.italic) text = `*${text}*`;
      if (item.annotations.strikethrough) text = `~~${text}~~`;
    }

    return text;
  }).join("");
}

// Convert Notion blocks to Markdown
function blocksToMarkdown(blocks) {
  if (!blocks || blocks.length === 0) return "";

  return blocks
    .map((block) => {
      if (!block) return null;

      const type = block.type;
      const content = block[type];

      switch (type) {
        case "paragraph": {
          const text = formatRichText(content?.rich_text);
          return text || null;
        }

        case "heading_1": {
          const text = formatRichText(content?.rich_text);
          return `# ${text}`;
        }

        case "heading_2": {
          const text = formatRichText(content?.rich_text);
          return `## ${text}`;
        }

        case "heading_3": {
          const text = formatRichText(content?.rich_text);
          return `### ${text}`;
        }

        case "bulleted_list_item": {
          const text = formatRichText(content?.rich_text);
          return `- ${text}`;
        }

        case "numbered_list_item": {
          const text = formatRichText(content?.rich_text);
          return `1. ${text}`;
        }

        case "to_do": {
          const text = formatRichText(content?.rich_text);
          const checked = content?.checked ? "[x]" : "[ ]";
          return `${checked} ${text}`;
        }

        case "code": {
          const text =
            content?.rich_text?.map((item) => item.plain_text).join("") || "";
          const language = content?.language || "";
          return `\`\`\`${language}\n${text}\n\`\`\``;
        }

        case "quote": {
          const text = formatRichText(content?.rich_text);
          return `> ${text}`;
        }

        case "divider": {
          return "---";
        }

        case "callout": {
          const text = formatRichText(content?.rich_text);
          const emoji = content?.icon?.emoji || "💡";
          return `> ${emoji} ${text}`;
        }

        case "image": {
          if (content?.type === "external") {
            return `![image](${content.external.url})`;
          }
          return null;
        }

        case "bookmark": {
          if (content?.url) {
            return `[Bookmark](${content.url})`;
          }
          return null;
        }

        default:
          // Ignore unsupported block types
          return null;
      }
    })
    .filter((text) => text !== null)
    .join("\n\n");
}

// Fetch all published posts from Notion
async function fetchAllPosts() {
  console.log("📥 Fetching posts from Notion...");

  try {
    const response = await notionFetch(
      `databases/${NOTION_DATABASE_ID}/query`,
      {
        method: "POST",
        body: JSON.stringify({
          filter: {
            property: "published",
            checkbox: { equals: true },
          },
          sorts: [
            {
              property: "date",
              direction: "descending",
            },
          ],
        }),
      },
    );

    console.log(`✅ Found ${response.results.length} published posts`);

    // Fetch full content for each post
    const posts = await Promise.all(
      response.results.map(async (page) => {
        console.log(
          `  📄 Fetching content for: ${parseRichText(page.properties.Title?.title || [])}`,
        );

        // Fetch blocks (content)
        const blocksResponse = await notionFetch(`blocks/${page.id}/children`, {
          method: "GET",
        });

        const content = blocksToMarkdown(blocksResponse.results);

        return {
          id: page.id,
          title: parseRichText(page.properties.Title?.title || []),
          slug: parseRichText(page.properties.slug?.rich_text || []),
          date:
            page.properties.date?.date?.start ||
            new Date().toISOString().split("T")[0],
          category: page.properties.category?.select?.name || "Uncategorized",
          excerpt: parseRichText(page.properties.excerpt?.rich_text || []),
          content,
        };
      }),
    );

    return posts;
  } catch (error) {
    console.error("❌ Error fetching posts from Notion:", error.message);
    throw error;
  }
}

// Main function
async function main() {
  try {
    const posts = await fetchAllPosts();

    // Create data directory if it doesn't exist
    const dataDir = join(__dirname, "..", "src", "data");
    const outputPath = join(dataDir, "posts.json");

    // Ensure data directory exists
    mkdirSync(dataDir, { recursive: true });

    // Write posts to JSON file
    writeFileSync(outputPath, JSON.stringify(posts, null, 2));

    console.log(`💾 Saved ${posts.length} posts to ${outputPath}`);
    console.log("✅ Done!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to fetch Notion data:", error);
    process.exit(1);
  }
}

main();

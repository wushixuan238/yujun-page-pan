# Yujun's Blog

A minimalist, terminal-inspired personal blog built with React + Vite + Notion.

## Features

- 🎨 Terminal-inspired UI design
- 📝 Blog posts managed via Notion database
- ⚡ Static site generation at build time
- 🚀 Deployed on GitHub Pages
- 📱 Fully responsive

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Notion API (Build-time fetching)
- **Deployment**: GitHub Pages + GitHub Actions

## How It Works

This blog uses a **build-time data fetching** strategy:

1. **Development**: Frontend reads from local `src/data/posts.json`
2. **Deployment**: GitHub Actions runs `scripts/fetch-notion.js` to fetch latest posts from Notion, generates `posts.json`, then builds the static site
3. **Production**: GitHub Pages serves static files (no API keys exposed, no CORS issues)

## Setup Guide

### 1. Notion Database Setup

#### Create a Notion Integration

1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Configure:
   - **Name**: `My Blog CMS`
   - **Workspace**: Select your workspace
   - **Capabilities**: Enable "Read content" and "Update content"
4. Click "Submit"
5. **Copy the Integration Token** (starts with `ntn_`)

#### Create Blog Database

1. In Notion, create a new page
2. Type `/table` and select "Table - Full page"
3. Add the following properties (columns):

| Property Name | Type | Description |
|---------------|------|-------------|
| **Title** | Title | Article title (default) |
| `slug` | Text | URL-friendly identifier (e.g., `my-first-post`) |
| `date` | Date | Publication date |
| `category` | Select | Category (add options: ENGINEERING, DESIGN, AI_RESEARCH, PHILOSOPHY) |
| `excerpt` | Text | Short summary |
| `published` | Checkbox | Whether to publish |
| `featured_image` | URL | Cover image (optional) |

4. **Share database with your Integration**:
   - Click `...` (top right of database)
   - Click "Add connections"
   - Select your integration (`My Blog CMS`)
   - Confirm

5. **Get Database ID**:
   - Copy the database URL
   - Format: `https://www.notion.so/workspace/DATABASE_ID?v=VIEW_ID`
   - Extract `DATABASE_ID` (32-character string)

#### Create Your First Post

1. Click "New" in the database
2. Fill in properties:
   - **Title**: Your article title
   - **slug**: `001-your-article-title` (unique, lowercase, hyphens)
   - **date**: Select date
   - **category**: Choose from dropdown
   - **excerpt**: Brief summary
   - **published**: ✅ Check
3. Write your article content in the page body (supports Markdown-style formatting)
4. The page will automatically appear on your blog after next deployment

### 2. GitHub Repository Setup

#### Add Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these two secrets:

1. **`NOTION_API_KEY`**
   - Value: Your Notion integration token (starts with `ntn_`)
   - This is safe - only GitHub Actions can access it

2. **`NOTION_DATABASE_ID`**
   - Value: Your Notion database ID (32 characters)
   - Example: `33f09eb5dd508059bf57f96b56d55150`

#### Environment Variables for Local Development

Create `.env` file in project root (this file is gitignored):

```bash
NOTION_API_KEY=ntn_your_notion_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

See `.env.example` for reference.

### 3. Deployment

The blog is automatically deployed when you push to `main` branch.

**Manual trigger**: You can also manually trigger deployment from GitHub Actions tab → "Deploy to GitHub Pages" → "Run workflow"

### 4. Local Development

```bash
# Install dependencies
bun install

# Fetch latest Notion data (requires .env variables)
bun run scripts/fetch-notion.js

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
yujun-page/
├── src/
│   ├── components/
│   │   ├── Archive.tsx      # Blog listing page
│   │   ├── Article.tsx      # Single article page
│   │   ├── Resume.tsx       # Resume page
│   │   └── Greeting.tsx     # Greeting component
│   ├── data/
│   │   └── posts.ts         # Local data loader (reads from posts.json)
│   ├── lib/
│   │   ├── notion.ts        # Notion API types (used by build script)
│   │   └── animation.ts     # Animation presets
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── scripts/
│   └── fetch-notion.js      # Fetches posts from Notion, generates posts.json
├── .github/
│   └── workflows/
│       └── deploy.yml       # GitHub Actions deployment workflow
├── posts/                   # (Deprecated) Old markdown posts
├── dist/                    # Built static files (generated)
├── src/data/posts.json      # Generated static post data (gitignored)
├── .env.example             # Environment variables template
├── .env                     # Local env (gitignored)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Adding New Articles

1. Open your Notion database
2. Click "New" and create a new page
3. Fill in all required properties:
   - **Title**: Article title
   - **slug**: Unique identifier (e.g., `005-my-new-article`)
   - **date**: Publication date
   - **category**: Select category
   - **excerpt**: Short summary
   - **published**: ✅ Check
4. Write your article content in the page body
5. The article will automatically appear on your blog after deployment

### Content Formatting

Notion supports rich formatting. Use these block types:

- **Paragraphs**: Regular text
- **Headings**: `# H1`, `## H2`, `### H3`
- **Lists**: Bulleted or numbered
- **Code blocks**: Wrap with ` ```language ` syntax
- **Quotes**: Use quote block
- **Callouts**: Use callout block (displays with emoji)
- **Images**: Insert image blocks

## Customization

### Change Categories

Edit `scripts/fetch-notion.js` → modify the category options in your Notion database accordingly.

### Modify Theme Colors

Colors are defined in `src/index.css` with Tailwind CSS classes:

- Background: `#FAF9F6` (off-white)
- Text: `#1A1C19` (near black)
- Accent: `#324A49` (teal)
- Secondary: `#4A6B6A` (muted teal)

### Adjust Archive Page Animation

Animation presets in `src/lib/animation.ts`:

```typescript
export const SPRING_PRESETS = {
  smooth: { damping: 25, stiffness: 200 },
  bouncy: { damping: 10, stiffness: 200 },
  steady: { damping: 30, stiffness: 100 },
};
```

## Troubleshooting

### No articles showing

1. Check that `published` checkbox is ticked in Notion
2. Verify `slug` field is not empty
3. Confirm GitHub Actions completed successfully
4. Check `src/data/posts.json` exists in built `dist/` folder

### 502 Bad Gateway error during deployment

This usually means Notion API rate limit exceeded. Wait a few minutes and redeploy.

### Articles not updating after Notion changes

The data is fetched only during build time. Trigger a new deployment to update.

### CORS errors in development

Make sure you have `.env` file with valid NOTION_API_KEY and NOTION_DATABASE_ID.

## Security Notes

- **Never commit `.env` file** - it's in `.gitignore`
- **Never expose NOTION_API_KEY** in client-side code
- **GitHub Secrets** store credentials securely for Actions
- Build-time fetching ensures API keys never reach the browser

## License

MIT

## Credits

Built with React + Vite + Notion API. Inspired by minimalist design and terminal aesthetics.

---

**Questions?** Open an issue or contact [@wushixuan238](https://github.com/wushixuan238)
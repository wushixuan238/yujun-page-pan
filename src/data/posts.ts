// Local posts data loader
// This reads from the static JSON file generated during build time
// In development, it falls back to empty array if file doesn't exist

import { type Post, type PostMeta } from '../lib/notion';

let cachedPosts: Post[] = [];

// Load posts from JSON file
function loadPosts(): Post[] {
  if (cachedPosts.length > 0) {
    return cachedPosts;
  }

  try {
    // Try to import the generated JSON
    const posts = require('../data/posts.json');
    cachedPosts = Array.isArray(posts) ? posts : [];
    return cachedPosts;
  } catch (error) {
    console.warn('[Posts] Could not load posts.json, falling back to empty array');
    // In development, the file might not exist yet
    cachedPosts = [];
    return cachedPosts;
  }
}

// Get all posts (sorted by date descending)
export function getPosts(): PostMeta[] {
  const posts = loadPosts();
  return posts.map(post => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.date,
    category: post.category,
    excerpt: post.excerpt,
  }));
}

// Get single post by slug
export function getPostBySlug(slug: string): Post | undefined {
  const posts = loadPosts();
  return posts.find(post => post.slug === slug);
}

// Get posts by category
export function getPostsByCategory(category: string): PostMeta[] {
  const allPosts = getPosts();
  if (category === 'ALL') {
    return allPosts;
  }
  return allPosts.filter(post => post.category === category);
}

// Get all unique categories
export function getCategories(): string[] {
  const posts = loadPosts();
  const categories = new Set(posts.map(post => post.category));
  return ['ALL', ...Array.from(categories)];
}

// Get single post by ID
export function getPostById(id: string): Post | undefined {
  const posts = loadPosts();
  return posts.find(post => post.id === id);
}

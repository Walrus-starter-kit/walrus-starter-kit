import type { GalleryIndex, GalleryItem } from '../types/gallery.js';

const INDEX_KEY = 'gallery-index';

export function loadIndex(): GalleryIndex {
  try {
    const stored = localStorage.getItem(INDEX_KEY);
    if (!stored) {
      return { version: '1.0', items: [], lastModified: Date.now() };
    }
    const parsed = JSON.parse(stored);
    if (!parsed.version || !Array.isArray(parsed.items)) {
      throw new Error('Invalid index format');
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to load gallery index, resetting:', error);
    return { version: '1.0', items: [], lastModified: Date.now() };
  }
}

export function saveIndex(index: GalleryIndex): void {
  index.lastModified = Date.now();
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function addItem(item: GalleryItem): void {
  const index = loadIndex();
  index.items.push(item);
  saveIndex(index);
}

export function removeItem(blobId: string): void {
  const index = loadIndex();
  index.items = index.items.filter((item) => item.blobId !== blobId);
  saveIndex(index);
}

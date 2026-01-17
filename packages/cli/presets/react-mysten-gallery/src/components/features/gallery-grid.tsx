import { useState, useEffect } from 'react';
import { FileCard } from './file-card.js';
import { loadIndex } from '../../utils/index-manager.js';
import type { GalleryItem } from '../../lib/walrus/types.js';

export function GalleryGrid() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const index = loadIndex();
    setItems(index.items);
  }, []);

  const refreshGallery = () => {
    const index = loadIndex();
    setItems(index.items);
  };

  return (
    <div className="gallery-grid">
      {items.length === 0 ? (
        <p className="text-secondary">No files yet. Upload your first file!</p>
      ) : (
        items.map((item) => (
          <FileCard key={item.blobId} item={item} onDelete={refreshGallery} />
        ))
      )}
    </div>
  );
}
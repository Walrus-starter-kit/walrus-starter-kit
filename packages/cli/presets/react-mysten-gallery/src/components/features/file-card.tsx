import { removeItem } from '../../utils/index-manager.js';
import type { GalleryItem } from '../../lib/walrus/types.js';

interface FileCardProps {
  item: GalleryItem;
  onDelete: () => void;
}

export function FileCard({ item, onDelete }: FileCardProps) {
  const handleDelete = () => {
    if (confirm(`Delete ${item.name}?`)) {
      removeItem(item.blobId);
      onDelete();
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="file-card">
      <h4>{item.name}</h4>
      <p className="text-secondary">Size: {formatBytes(item.size)}</p>
      <p className="text-secondary">Uploaded: {formatDate(item.uploadedAt)}</p>
      <p className="blob-id text-accent">{item.blobId.slice(0, 16)}...</p>
      <button onClick={handleDelete} className="btn-danger">
        Delete
      </button>
    </div>
  );
}
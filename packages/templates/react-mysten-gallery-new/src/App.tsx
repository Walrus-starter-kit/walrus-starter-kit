import { useState } from 'react';
import { AppLayout } from './components/layout/app-layout.js';
import { GalleryGrid } from './components/features/gallery-grid.js';
import { UploadModal } from './components/features/upload-modal.js';
import './index.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <AppLayout>
      <div className="gallery-app">
        <h2>
          <span className="text-accent">🖼️</span> File Gallery
        </h2>
        <p className="text-secondary">
          Upload files to <span className="text-accent">Walrus</span> and manage
          them in a persistent gallery
        </p>

        <section className="upload-section">
          <UploadModal onSuccess={() => setRefreshKey((k) => k + 1)} />
        </section>

        <section className="gallery-section">
          <GalleryGrid key={refreshKey} />
        </section>
      </div>
    </AppLayout>
  );
}

export default App;

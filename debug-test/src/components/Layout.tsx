import { ReactNode } from 'react';
import { WalletConnect } from './WalletConnect.js';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="app-layout">
      <header className="app-header">
        <h1>🌊 Walrus App</h1>
        <WalletConnect />
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>Powered by Walrus & Sui</p>
      </footer>
    </div>
  );
}

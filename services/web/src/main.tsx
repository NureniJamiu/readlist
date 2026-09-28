import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

const AppShell: React.FC = () => {
  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <span className="eyebrow-label">Personal Backlog</span>
        <h1 className="text-3xl font-bold text-wine">ReadList</h1>
      </div>
    </main>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppShell />
    </React.StrictMode>
  );
}

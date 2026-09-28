import { createApp } from './app.js';

const PORT = process.env.PORT || 3001;
const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`[ReadList API] Server listening on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('[ReadList API] Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

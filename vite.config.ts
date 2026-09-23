import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      // Ignore archive files (e.g. ones created by external backup/AV tools)
      // that can be locked mid-write and crash chokidar's watcher.
      ignored: ['**/*.rar', '**/*.zip', '**/*.7z'],
    },
  },
});

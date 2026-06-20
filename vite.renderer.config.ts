import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

function copyAngularBuild() {
  return {
    name: 'copy-angular-build',
    configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
      const distDir = path.resolve(__dirname, 'renderer/app/dist/app/browser');
      server.middlewares.use((req: { url?: string }, res: { writeHead: (code: number, headers: Record<string, string>) => void; end: (data: Buffer) => void }, next: () => void) => {
        if (!req.url || req.url === '/') return next();
        const filePath = path.join(distDir, req.url);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath);
          const mimeTypes: Record<string, string> = {
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.ico': 'image/x-icon',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.gif': 'image/gif',
          };
          res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
          res.end(fs.readFileSync(filePath));
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [copyAngularBuild()],
});

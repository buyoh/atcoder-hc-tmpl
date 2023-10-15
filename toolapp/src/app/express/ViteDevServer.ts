import { Express } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';

export async function applyViteDevMiddlewares(
  app: Express,
  cwd: string
): Promise<void> {
  if (!fs.existsSync(cwd)) throw new Error(`No such directory: ${cwd}`);

  const vite = await createServer({
    root: cwd,
    logLevel: 'info',
    server: {
      middlewareMode: true,
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  });

  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      const html = fs.readFileSync(path.resolve(cwd, 'index.html'), 'utf-8');

      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(await vite.transformIndexHtml(url, html));
    } catch (e) {
      if (e instanceof Error) {
        vite && vite.ssrFixStacktrace(e);
        console.warn(e, e.stack);
        res.status(500).end(e.stack);
      }
    }
  });
}

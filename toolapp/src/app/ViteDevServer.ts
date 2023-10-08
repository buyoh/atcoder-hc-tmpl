import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer } from 'vite';

//https://zenn.dev/ddpn08/articles/ac30dae3e7c7ea
export async function createViteDevServer(
  cwd: string
): Promise<{ app: express.Express; vite: any }> {
  if (!fs.existsSync(cwd)) throw new Error(`No such directory: ${cwd}`);
  // const app = express.Router();
  const app = express();

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
    console.log(req.url);
    try {
      const url = req.originalUrl;
      console.log(req.url);

      const html = fs.readFileSync(path.resolve(cwd, 'index.html'), 'utf-8');

      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(await vite.transformIndexHtml(url, html));
    } catch (e) {
      if (e instanceof Error) {
        vite && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
    }
  });

  return { app, vite };
}

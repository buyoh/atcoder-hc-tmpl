import * as Ex from 'express';

export async function applyStaticAssetsMiddlewares(
  app: Ex.Express,
  cwd: string
): Promise<void> {
  app.use(Ex.static('dist'));
}
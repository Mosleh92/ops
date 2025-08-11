export function registerHealth(app: any) {
  app.get?.('/healthz', (_req: any, res: any) => res.status(200).send('ok'));
}

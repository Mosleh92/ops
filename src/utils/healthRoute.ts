import type { Express, Request, Response } from 'express'

export function registerHealth(app: Express) {
  app.get('/healthz', (_req: Request, res: Response) => res.status(200).send('ok'))
}

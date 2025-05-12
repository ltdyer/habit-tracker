import { Request, Response } from "express";

export const loggingHandler = (req: Request, res: Response) => {
  logging.log(`Incoming: ${req.method}`)
}
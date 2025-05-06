import { Request, Response } from "express";

export const getBirds = (req: Request, res: Response): void => {
  res.status(200).json([
    { name: "red-tailed swallow" },
    { name: "huge bird" }
  ]);
};

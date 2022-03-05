import { Request, Response } from "express";

export const handle404 = (req: Request, res: Response): void => {
  res.status(404).send({ message: `${req.url} is not a valid endpoint.` });
};


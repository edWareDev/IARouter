import { Router } from "express";
import { getMailsController } from "../controllers/api/get-mails.controller.js";

export const apiRouter = Router();

apiRouter.post("/get-mails", getMailsController);


apiRouter.get("/status", (_, res) => res.json({ api: "ok" }));
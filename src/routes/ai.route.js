import { Router } from "express";
import { tagMailController } from "../controllers/ai/tag-mail.controller.js";
import { sumarizeMailController } from "../controllers/ai/sumarize-mail.controller.js";

export const aiRouter = Router();

aiRouter.post("/tag-mail", tagMailController);
aiRouter.post("/sumarize-mail", sumarizeMailController);


aiRouter.get("/status", (_, res) => res.json({ ai: "ok" }));
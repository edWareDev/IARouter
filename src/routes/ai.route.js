import { Router } from "express";
import { tagMailController } from "../controllers/ai/tag-mail.controller.js";
import { sumarizeMailController } from "../controllers/ai/sumarize-mail.controller.js";
import { embedPDFToDB } from "../controllers/ai/embed-pdf-to-db.controller.js";
import { questionToPDFController } from "../controllers/ai/question-to-pdf.controller.js";

export const aiRouter = Router();

aiRouter.post("/tag-mail", tagMailController);
aiRouter.post("/sumarize-mail", sumarizeMailController);
aiRouter.post("/embed-pdf", embedPDFToDB);
aiRouter.post("/question-to-pdf", questionToPDFController);


aiRouter.get("/status", (_, res) => res.json({ ai: "ok" }));
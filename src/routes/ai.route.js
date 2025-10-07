import { Router } from "express";
import { tagMailController } from "../controllers/ai/tag-mail.controller.js";
import { sumarizeMailController } from "../controllers/ai/sumarize-mail.controller.js";
import { embedPDFToDB } from "../controllers/files/embed-pdf-to-db.controller.js";
import { questionToDocController } from "../controllers/ai/question-to-doc.controller.js";
import { generateQuestionOfDocController } from "../controllers/ai/generate-question-of-doc.controller.js";

export const aiRouter = Router();

aiRouter.post("/tag-mail", tagMailController);
aiRouter.post("/sumarize-mail", sumarizeMailController);
aiRouter.post("/embed-pdf", embedPDFToDB);
aiRouter.post("/question-to-doc/:docName", questionToDocController);
aiRouter.post("/generate-question-of-doc/:docName", generateQuestionOfDocController);


aiRouter.get("/status", (_, res) => res.json({ ai: "ok" }));
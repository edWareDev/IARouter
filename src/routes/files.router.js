import { Router } from "express";
import { embedPDFToDB } from "../controllers/files/embed-pdf-to-db.controller.js";
import multer from "multer";
import { listAllCollectionsController } from "../controllers/files/list-files.controller.js";
import { deleteCollectionController } from "../controllers/files/deleteFile.controller.js";

const upload = multer({ dest: 'uploads/' });

export const filesRouter = Router();

filesRouter.get("/list-collections", listAllCollectionsController);
filesRouter.post("/embed-doc", upload.single('doc'), embedPDFToDB);
filesRouter.delete("/delete/:name", deleteCollectionController);


filesRouter.get("/status", (_, res) => res.json({ files: "ok" }));
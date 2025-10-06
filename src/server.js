import express from 'express';
import cors from 'cors';
import { startServer } from './lib/api-rest.js';
import { apiRouter } from './routes/api.route.js';
import { aiRouter } from './routes/ai.route.js';

const app = express();
app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);
app.use("/ai", aiRouter);
app.use("/{*splat}", (_, res) => res.json({ error: "Ruta inválida" }));

await startServer(app);
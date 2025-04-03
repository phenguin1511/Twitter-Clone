import { Router } from "express";
import mediaController from "~/controllers/medias.controllers.js";
import wrapRequestHandler from "~/utils/handlers.js";
const staticRouter = Router();

staticRouter.get("/image/:filename", wrapRequestHandler(mediaController.serveImageController));
staticRouter.get("/video/:filename", wrapRequestHandler(mediaController.serveVideoController));
staticRouter.get("/video-stream/:filename", wrapRequestHandler(mediaController.serveVideoStreamController));

export default staticRouter;

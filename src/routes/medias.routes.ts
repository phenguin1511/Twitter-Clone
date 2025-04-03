import { Router } from 'express';
import mediaController from '../controllers/medias.controllers.js';
import wrapRequestHandler from '../utils/handlers.js';

const mediasRouter = Router();

mediasRouter.post('/upload-image', wrapRequestHandler(mediaController.uploadImageController));

export default mediasRouter;


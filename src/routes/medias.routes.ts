import { Router } from 'express';
import mediaController from '../controllers/medias.controllers.js';
import wrapRequestHandler from '../utils/handlers.js';
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.midlewares.js';

const mediasRouter = Router();

mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(mediaController.uploadImageController));
mediasRouter.post('/upload-video', accessTokenValidator, verifiedUserValidator, wrapRequestHandler(mediaController.uploadVideoController));
export default mediasRouter;


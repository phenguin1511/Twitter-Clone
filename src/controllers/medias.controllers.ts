import { Request, Response, NextFunction } from 'express';

import mediaService from '~/services/medias.services.js';

class MediaController {
      uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
            const url = await mediaService.hanldeUploadSingleImage(req);
            return res.status(200).json({
                  message: 'Upload image successfully',
                  url
            });
      }
}

const mediaController = new MediaController();
export default mediaController;

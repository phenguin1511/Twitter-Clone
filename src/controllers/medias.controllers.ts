import { Request, Response, NextFunction } from 'express';

import mediaService from '~/services/medias.services.js';

class MediaController {
      uploadSingleImage = async (req: Request, res: Response, next: NextFunction) => {
            const data = await mediaService.hanldeUploadSingleImage(req);
            return res.status(200).json({
                  message: 'Upload image successfully',
                  data
            });
      }
}

const mediaController = new MediaController();
export default mediaController;

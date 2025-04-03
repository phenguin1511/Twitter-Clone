import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { UPLOAD_IMAGE_DIR } from '~/constants/dir.js';
import fs from 'fs';
import mediaService from '~/services/medias.services.js';

class MediaController {
      uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
            const url = await mediaService.hanldeUploadImage(req);
            return res.status(200).json({
                  message: 'Upload image successfully',
                  url
            });
      }

      serveImageController = async (req: Request, res: Response) => {
            const { filename } = req.params;
            const filePath = path.resolve(UPLOAD_IMAGE_DIR, filename);
            if (!fs.existsSync(filePath)) {
                  return res.status(404).json({
                        message: 'Image not found'
                  });
            }
            res.status(200).sendFile(filePath);
      }

      uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
            const url = await mediaService.hanldeUploadVideo(req);
            return res.status(200).json({
                  message: 'Upload video successfully',
                  url
            });
      }
}

const mediaController = new MediaController();
export default mediaController;

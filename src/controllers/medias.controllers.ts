import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir.js';
import fs from 'fs';
import mediaService from '~/services/medias.services.js';
import HTTP_STATUS from '~/constants/httpStatus.js';
import mime from 'mime';
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

      serveVideoController = async (req: Request, res: Response) => {
            const { filename } = req.params;
            const filePath = path.resolve(UPLOAD_VIDEO_DIR, filename);
            if (!fs.existsSync(filePath)) {
                  return res.status(404).json({
                        message: 'Video not found'
                  });
            }
            res.status(200).sendFile(filePath);
      }

      serveVideoStreamController = async (req: Request, res: Response) => {
            const range = req.headers.range;
            if (!range) {
                  return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range Header')
            }
            const { filename } = req.params;
            const videoPath = path.resolve(UPLOAD_VIDEO_DIR, filename);
            const videoSize = fs.statSync(videoPath).size;
            const CHUNK_SIZE = 10 ** 6;
            const start = Number(range.replace(/\D/g, ''));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
            const contentLength = end - start + 1;
            const contentType = mime.getType(videoPath) || 'video/*';
            const headers = {
                  'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                  'Accept-Ranges': 'bytes',
                  'Content-Length': contentLength,
                  'Content-Type': contentType
            }
            res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers);
            const videoStream = fs.createReadStream(videoPath, { start, end });
            videoStream.pipe(res);
      }

}

const mediaController = new MediaController();
export default mediaController;

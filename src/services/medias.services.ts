import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "~/constants/dir.js";
import { getNewFileName } from "~/utils/file.js";
import { hanldeUploadSingleImageService } from "~/utils/file.js";
import fs from "fs";
import { Request } from "express";
import { isProduction } from "~/constants/config.js";
import dotenv from "dotenv";

dotenv.config();

class MediaService {
      async hanldeUploadSingleImage(req: Request) {
            const data = await hanldeUploadSingleImageService(req);
            const newFileName = getNewFileName(data.newFilename as string);
            const newFilePath = path.resolve(UPLOAD_DIR, `${newFileName}.jpg`);
            const imageBuffer = await fs.promises.readFile(data.filepath);
            await sharp(imageBuffer).jpeg().toFile(newFilePath);
            await fs.promises.unlink(data.filepath);
            return isProduction ? `${process.env.HOST}/uploads/${newFileName}.jpg` : `http://localhost:${process.env.PORT}/uploads/${newFileName}.jpg`;

      }
}

const mediaService = new MediaService();
export default mediaService;


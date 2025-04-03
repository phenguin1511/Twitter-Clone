import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "~/constants/dir.js";
import { getNewFileName } from "~/utils/file.js";
import { hanldeUploadImageService } from "~/utils/file.js";
import fs from "fs";
import { Request } from "express";
import { isProduction } from "~/constants/config.js";
import dotenv from "dotenv";
import { MediaType } from "~/constants/enum.js";
import { Media } from "~/models/Orther.js";
dotenv.config();

class MediaService {
      async hanldeUploadImage(req: Request) {
            const data = await hanldeUploadImageService(req);
            const result: Media[] = await Promise.all(data.map(async (file) => {
                  const newFileName = getNewFileName(file.newFilename as string);
                  const newFilePath = path.resolve(UPLOAD_DIR, `${newFileName}.jpg`);
                  const imageBuffer = await fs.promises.readFile(file.filepath);
                  await sharp(imageBuffer).jpeg().toFile(newFilePath);
                  await fs.promises.unlink(file.filepath);
                  return {
                        url: isProduction ? `${process.env.HOST}/static/${newFileName}.jpg` : `http://localhost:${process.env.PORT}/static/${newFileName}.jpg`,
                        type: MediaType.Image
                  };
            }));
            return result;
      }
}

const mediaService = new MediaService();
export default mediaService;


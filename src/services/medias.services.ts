import path from "path";
import sharp from "sharp";
import { UPLOAD_DIR } from "~/constants/dir.js";
import { getNewFileName } from "~/utils/file.js";
import { hanldeUploadSingleImageService } from "~/utils/file.js";
import fs from "fs";
import { Request } from "express";

class MediaService {
      async hanldeUploadSingleImage(req: Request) {
            const data = await hanldeUploadSingleImageService(req);
            const newFileName = getNewFileName(data.newFilename as string);
            const newFilePath = path.resolve(UPLOAD_DIR, `${newFileName}.jpg`);
            await sharp(data.filepath).jpeg().toFile(newFilePath);
            await fs.promises.unlink(data.filepath);
            return `http://localhost:3000/uploads/${newFileName}.jpg`;
      }
}

const mediaService = new MediaService();
export default mediaService;


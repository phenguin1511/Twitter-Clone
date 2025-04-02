import path from "path";
import fs from "fs";
import { Request } from "express";
import formidable from "formidable";
import { File } from "formidable";
import { TEMP_DIR } from "~/constants/dir.js";

export const initFolder = () => {
      if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
      }
};


export const hanldeUploadSingleImageService = async (req: Request) => {
      const form = formidable({
            uploadDir: TEMP_DIR,
            maxFiles: 1,
            maxFileSize: 3000 * 1024,
            filter: function ({ name, originalFilename, mimetype }) {
                  const valid = name === 'image' && Boolean(mimetype?.includes('image'));
                  if (!valid) {
                        form.emit('error' as any, new Error('Invalid image') as any);
                  }
                  return valid;
            }
      });
      return new Promise<File>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                  if (err) {

                        return reject(err);
                  }
                  if (!Boolean(files.image)) {
                        return reject(new Error('No image uploaded'));
                  }
                  resolve((files.image as File[])[0]);
            });
      });
};

export const getNewFileName = (newFilename: string) => {
      const ext = path.extname(newFilename);
      const name = path.basename(newFilename, ext);
      return `${Date.now()}-${name}${ext}`;
};



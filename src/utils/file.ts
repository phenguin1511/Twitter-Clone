import path from "path";
import fs from "fs";
import e, { Request } from "express";
import formidable from "formidable";
import { File } from "formidable";
import { IMAGE_TEMP_DIR, UPLOAD_IMAGE_DIR, VIDEO_TEMP_DIR, UPLOAD_VIDEO_DIR } from "~/constants/dir.js";

export const initFolder = () => {
      if (!fs.existsSync(IMAGE_TEMP_DIR)) {
            fs.mkdirSync(IMAGE_TEMP_DIR, { recursive: true });
      }
      if (!fs.existsSync(VIDEO_TEMP_DIR)) {
            fs.mkdirSync(VIDEO_TEMP_DIR, { recursive: true });
      }
      if (!fs.existsSync(UPLOAD_IMAGE_DIR)) {
            fs.mkdirSync(UPLOAD_IMAGE_DIR, { recursive: true })
      }
      if (!fs.existsSync(UPLOAD_VIDEO_DIR)) {
            fs.mkdirSync(UPLOAD_VIDEO_DIR, { recursive: true });
      }
};


export const hanldeUploadImageService = async (req: Request) => {
      const form = formidable({
            uploadDir: IMAGE_TEMP_DIR,
            maxFiles: 4,
            maxFileSize: 3000 * 1024,
            maxTotalFileSize: 3000 * 1024 * 4,
            filter: function ({ name, originalFilename, mimetype }) {
                  const valid = name === 'image' && Boolean(mimetype?.includes('image'));
                  if (!valid) {
                        form.emit('error' as any, new Error('Invalid image') as any);
                  }
                  return valid;
            }
      });
      return new Promise<File[]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                  if (err) {
                        return reject(err);
                  }
                  if (!Boolean(files.image)) {
                        return reject(new Error('No image uploaded'));
                  }
                  resolve(files.image as File[]);
            });
      });
};

export const getNewFileName = (newFilename: string) => {
      const ext = path.extname(newFilename);
      const name = path.basename(newFilename, ext);
      return `${Date.now()}-${name}${ext}`;
};


export const hanldeUploadVideoService = async (req: Request) => {
      const form = formidable({
            uploadDir: UPLOAD_VIDEO_DIR,
            maxFiles: 4,
            maxFileSize: 50 * 1024 * 1024,
            maxTotalFileSize: 50 * 1024 * 1024 * 4,
            filter: function ({ name, originalFilename, mimetype }) {
                  const valid = name === 'video' && Boolean(mimetype?.includes('video')) || Boolean(mimetype?.includes('quicktime'));
                  if (!valid) {
                        form.emit('error' as any, new Error('Invalid video') as any);
                  }
                  return valid;
            }
      });
      return new Promise<File[]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                  if (err) {
                        return reject(err);
                  }
                  if (!Boolean(files.video)) {
                        return reject(new Error('No video uploaded'));
                  }
                  const videos = files.video as File[];
                  videos.forEach((video) => {
                        const ext = getExtention(video.originalFilename as string);
                        fs.renameSync(video.filepath, video.filepath + '.' + ext);
                        video.newFilename = video.newFilename + '.' + ext;
                  })
                  resolve(files.video as File[]);
            });
      });
};


const getExtention = (fullname: string) => {
      const namearr = fullname.split('.');
      return namearr[namearr.length - 1]
}
import { Request } from "express";
import { extname, join } from "path";
import { DestinationCallback, FileNameCallback } from "../types/multer.type";
import { mkdirSync } from "fs";
import { MulterFile } from "../types/public.type";


export function multerDestination(fieldName: string) {
    return (req: Request, file: MulterFile, callback: DestinationCallback) => {
        let path = join("public", "upload", fieldName);
        mkdirSync(path, { recursive: true });
        callback(null, path)
    }
}
export function multerFileName(req: Request, file: MulterFile, callback: FileNameCallback) {
    const ext = extname(file.originalname);
    const newName = `${Date.now()}${ext}`;
    callback(null, newName)

}
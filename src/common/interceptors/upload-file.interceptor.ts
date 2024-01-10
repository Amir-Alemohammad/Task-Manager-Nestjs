import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { multerDestination, multerFileName } from "../utils/multer.util";

export function UploadFile(fieldName: string) {
    return class UploadUtility extends FileInterceptor(fieldName, {
        storage: diskStorage({
            destination: multerDestination(fieldName),
            filename: multerFileName
        }),
    }) { }
}
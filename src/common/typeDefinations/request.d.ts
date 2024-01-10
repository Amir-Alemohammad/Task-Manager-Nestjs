import express from "express";
import { IUser } from "src/module/user/interface/user-request.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}
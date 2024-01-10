export type MulterFile = Express.Multer.File
export type UserCookieType = {
    username: string;
    role: string;
}
export type Tokens = {
    access_token?: string;
    refresh_token?: string
}
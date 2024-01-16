export type MulterFile = Express.Multer.File
export type UserCookieType = {
    username: string;
    role: string[];
}
export type Tokens = {
    access_token?: string;
    refresh_token?: string
}
export type TPermission = {
    name: string;
    description: string;
    slug: string;
}
export type TRoles = {
    name: string;
    description: string;
    permissions?: TPermission[]
}
export type TUser = {
    username: string;
    password: string;
    role?: string[];
    roles?: TRoles[];
}
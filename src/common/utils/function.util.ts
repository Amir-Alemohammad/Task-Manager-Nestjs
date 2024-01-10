import { Request } from "express";
import * as path from "path";
import * as fs from 'fs';
import * as qs from 'querystring';
import { UserEntity } from "src/module/user/entities/user.entity";
import { IUser } from "src/module/user/interface/user-request.interface";


export function removeEmptyFieldsObject(obj: object): any {
    for (const field in obj) {
        ['', ' ', null, undefined].includes(obj[field]) ? delete obj[field] : true;
    }
    return { ...obj }
}
export function getAccessTokenFromRequest(req: Request) {
    const headerCookies: any = qs.parse(req?.headers?.cookie);
    const bearerToken = req?.headers?.authorization
    const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
    const accessToken = req?.signedCookies?.access_token ?? req?.cookies?.access_token ?? headerCookies?.access_token ?? token ?? null;
    return accessToken;
}
export function paginationSolver(page: number = 1, limit: number = 10) {
    if (!page || page < 1) {
        page = 0
    }
    if (!limit || limit <= 0) limit = 10;
    const skip = page * limit;
    return {
        page,
        limit,
        skip
    }
}
export function paginationGenerator(count: number = 0, page: number = 0, limit: number = 0) {
    return {
        totalCount: count,
        page: +page,
        count: limit,
        pageCount: Math.ceil(count / limit)
    }
}
export function getRefreshTokenFromRequest(req: Request) {
    const headerCookies: any = qs.parse(req?.headers?.cookie);
    // const tokenHeader = req?.headers?.['refresh-token']
    // const tokenBody = req?.body?.['refresh_token']
    const refreshToken = req?.signedCookies?.refresh_token ?? req?.cookies?.refresh_token ?? headerCookies?.refresh_token ?? null;
    return refreshToken
}
export function getUserResponse(user: UserEntity): IUser {
    return {
        id: user.id,
        username: user.username,
        role: user.role,
    };
}
export function removeFileInPublic(fileAddress: string) {
    const filePath = path.join(process.cwd(), fileAddress)
    fs.unlinkSync(filePath)
}
import { CookieOptions } from "express"
import { UserCookieType } from "src/common/types/public.type"
import { UserEntity } from "src/module/user/entities/user.entity"
export function GetTokenCookieOption(expires: number): CookieOptions {
    return {
        httpOnly: true,
        secure: false, // for production is true
        signed: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + expires),
        domain: 'localhost',
    }
}
export function GetUserCookieData(user: UserEntity): UserCookieType {
    return {
        username: user.username,
        role: user.role,
    }
}
export function GetUserCookieOption(expires: number): CookieOptions {
    return {
        httpOnly: true,
        secure: false, // for production is true
        signed: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + expires),
        domain: 'localhost',
    }
}
import { Request, Response } from "express"
import { GetTokenCookieOption, GetUserCookieData, GetUserCookieOption } from "src/config/set-cookie.config";
import { RefreshTokenExpires, AccessTokenExpires } from "../constant/expires-data.constant";
import { HttpStatus } from "@nestjs/common";
import { UserEntity } from "src/module/user/entities/user.entity";
import { AuthMessages } from "src/module/auth/enum/auth.message";
import { CookieKeys } from "../enum/cookie.enum";
type TokenType = { access_token: string, refresh_token: string }
type LoginResponse = TokenType & {
    role: string;
}
export async function setAuthCookies(req: Request, res: Response, user: UserEntity, response: LoginResponse) {
    const { access_token, refresh_token, role } = response;
    const userObject = GetUserCookieData(user);
    Object.assign(userObject, { role });
    res.cookie(CookieKeys.AccessToken, access_token, GetTokenCookieOption(AccessTokenExpires))
    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires))
    res.cookie(CookieKeys.User, userObject, GetUserCookieOption(AccessTokenExpires))
    res.send({
        statusCode: HttpStatus.OK,
        data: {
            message: AuthMessages.SuccessLogin,
            access_token,
            refresh_token,
            role
        }
    })
}
export async function justSetAuthCookies(req: Request, res: Response, user: UserEntity, response: LoginResponse) {
    const { access_token, refresh_token, role } = response;
    const userObject = GetUserCookieData(user);
    Object.assign(userObject, { role });
    res.cookie(CookieKeys.AccessToken, access_token, GetTokenCookieOption(AccessTokenExpires))
    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires))
    res.cookie(CookieKeys.User, userObject, GetUserCookieOption(AccessTokenExpires))
}
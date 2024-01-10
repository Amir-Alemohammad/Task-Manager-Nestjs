import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from '../auth.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from 'src/module/user/interface/user-request.interface';
import { UserEntity } from 'src/module/user/entities/user.entity';
import { JwtPayloadDto } from '../dto/payload.dto';
import { JwtError } from 'src/common/enum/error.enum';
import { AuthMessages } from '../enum/auth.message';
import { justSetAuthCookies } from 'src/common/utils/auth-cookie.util';
import { getUserResponse } from 'src/common/utils/function.util';
import { GetTokenCookieOption, GetUserCookieData, GetUserCookieOption } from 'src/config/set-cookie.config';
import { CookieKeys } from 'src/common/enum/cookie.enum';
import { AccessTokenExpires, RefreshTokenExpires } from 'src/common/constant/expires-data.constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        private authService: AuthService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    ) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<any> {
        const ctx = context.switchToHttp();
        const req: Request = ctx.getRequest<Request>();
        const res: Response = ctx.getResponse<Response>();
        const accessToken = this.authService.getTokenFromRequestAsCookie(req);
        const refreshToken = this.authService.getRefreshTokenFromRequestAsCookie(req);
        if (accessToken) {
            const jwtVerifyResult = await this.authService.verifyAccessToken(accessToken);
            if (typeof jwtVerifyResult == "string" && jwtVerifyResult == JwtError.Expires) {
                let refreshTokenVerifyResult: JwtPayloadDto | string = await this.authService.verifyRefreshTokenJwt(refreshToken);
                if (typeof refreshTokenVerifyResult == "string" && refreshTokenVerifyResult == JwtError.Expires) {
                    throw new UnauthorizedException(AuthMessages.Login);
                } else if (typeof refreshTokenVerifyResult == "object" && "id" in refreshTokenVerifyResult) {
                    const user = await this.userRepository.findOneBy({ id: +refreshTokenVerifyResult.id });
                    if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);

                    const access_token = this.authService.signAccess_tokenJwt({ id: user.id });
                    const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                    Object.assign(user, { access_token, refresh_token });
                    await this.userRepository.save(user);
                    justSetAuthCookies(req, res, user, { access_token, refresh_token, role: user.role })
                    const userObject: IUser = getUserResponse(user);
                    req.user = userObject
                } else {
                    throw new UnauthorizedException(AuthMessages.LoginAgain);
                }
            } else if (typeof jwtVerifyResult == "object" && "id" in jwtVerifyResult) {
                const user = await this.userRepository.findOneBy({ id: +jwtVerifyResult.id });
                if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);
                const userObjectResponse = GetUserCookieData(user);
                res.cookie(CookieKeys.User, userObjectResponse, GetUserCookieOption(AccessTokenExpires))
                const userObject: IUser = getUserResponse(user);
                req.user = userObject
                if (!refreshToken) {
                    const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                    res.cookie(CookieKeys.RefreshToken, refresh_token, GetTokenCookieOption(RefreshTokenExpires));
                    Object.assign(user, { refresh_token });
                    await this.userRepository.save(user);
                }
            } else {
                throw new UnauthorizedException(AuthMessages.LoginAgain);
            }
        } else if (refreshToken) {
            let refreshTokenVerifyResult: JwtPayloadDto | string = await this.authService.verifyRefreshTokenJwt(refreshToken);
            if (typeof refreshTokenVerifyResult == "string" && refreshTokenVerifyResult == JwtError.Expires) {
                throw new UnauthorizedException(AuthMessages.Login);
            } else if (typeof refreshTokenVerifyResult == "object" && "id" in refreshTokenVerifyResult) {
                const user = await this.userRepository.findOneBy({ id: +refreshTokenVerifyResult.id });
                if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);
                const access_token = this.authService.signAccess_tokenJwt({ id: user.id });
                const refresh_token = this.authService.signRefresh_tokenJwt({ id: user.id });
                Object.assign(user, { access_token, refresh_token });
                await this.userRepository.save(user);
                justSetAuthCookies(req, res, user, { access_token, refresh_token, role: user.role })
                const userObject: IUser = getUserResponse(user);
                req.user = userObject
            } else {
                throw new UnauthorizedException(AuthMessages.LoginAgain);
            }
        }
        return super.canActivate(context);
    }
}
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request, Response } from "express";
import { Observable } from "rxjs";
import { Repository } from "typeorm";
import { UserEntity } from "../../module/user/entities/user.entity";
import { AuthService } from "../../module/auth/auth.service";
import { JwtPayloadDto } from "../../module/auth/dto/payload.dto";
import { IUser } from "../../module/user/interface/user-request.interface";
import { JwtError } from "../enum/error.enum";
import { AuthMessages } from "../../module/auth/enum/auth.message";
import { getUserResponse } from "../utils/function.util";
import { justSetAuthCookies } from "../utils/auth-cookie.util";
@Injectable()
export default class AddUserToRequestInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private authService: AuthService,
    ) { }
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req: Request = context.switchToHttp().getRequest<Request>();
        const res: Response = context.switchToHttp().getResponse<Response>();
        const token = this.authService.getTokenFromRequestAsCookie(req);
        const jwtVerifyResult: JwtPayloadDto | string = await this.authService.verifyAccessToken(token);
        if (typeof jwtVerifyResult == "string" && jwtVerifyResult == JwtError.Expires) {
            const token = this.authService.getRefreshTokenFromRequestAsCookie(req);
            let refreshTokenVerifyResult: JwtPayloadDto | string = await this.authService.verifyRefreshTokenJwt(token);
            if (typeof refreshTokenVerifyResult == "string" && refreshTokenVerifyResult == JwtError.Expires) {
                throw new UnauthorizedException(AuthMessages.Login);
            } else if (typeof refreshTokenVerifyResult == "object" && "id" in refreshTokenVerifyResult) {
                const user = await this.userRepository.findOneBy({ id: refreshTokenVerifyResult.id });
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
            const user = await this.userRepository.findOneBy({ id: jwtVerifyResult.id });
            if (!user) throw new UnauthorizedException(AuthMessages.NotFoundAccount);
            const userObject: IUser = getUserResponse(user);
            req.user = userObject
        } else {
            throw new UnauthorizedException(AuthMessages.LoginAgain);
        }
        return next.handle().pipe()
    }
}
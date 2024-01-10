import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayloadDto } from '../dto/payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { UserEntity } from 'src/module/user/entities/user.entity';
import { AuthMessages } from '../enum/auth.message';
import { getAccessTokenFromRequest, getRefreshTokenFromRequest } from 'src/common/utils/function.util';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
    ) {
        let superData: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWTFromCookie,
            ]),
            secretOrKeyProvider: (req: Request, jwtToken, done) => {
                const token = getAccessTokenFromRequest(req);
                const refreshToken = getRefreshTokenFromRequest(req)
                if (token) return done(null, process.env.ACCESS_TOKEN_SECRET);
                else if (refreshToken) return done(null, process.env.REFRESH_TOKEN_SECRET);
                throw new UnauthorizedException(AuthMessages.Login)
            },
        }
        super(superData)
    }
    private static extractJWTFromCookie(req: Request): string | null {
        const token = getAccessTokenFromRequest(req);
        const refreshToken = getRefreshTokenFromRequest(req)
        if (!token) {
            if (refreshToken) {
                return refreshToken;
            } else throw new UnauthorizedException(AuthMessages.Login)
        }
        return token
    }
    async validate(payload: JwtPayloadDto) {
        const user = await this.userRepository.findOneBy({ id: +payload.id });
        if (!user) throw new UnauthorizedException(AuthMessages.Login);
        return user
    }
}

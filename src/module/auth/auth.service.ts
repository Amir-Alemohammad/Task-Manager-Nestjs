import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { JwtPayloadDto } from "./dto/payload.dto";
import { AuthEnum } from "src/common/enum/auth.enum";
import { parse } from 'querystring'
import { Request } from "express";
import { AuthMessages } from "./enum/auth.message";
import { JwtError } from "src/common/enum/error.enum";
import { removeEmptyFieldsObject } from "src/common/utils/function.util";
import { ROLES } from "src/common/enum/roles.enum";
import { compareSync, hashSync } from 'bcrypt'
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }
    async register(registerDto: RegisterDto) {
        registerDto = removeEmptyFieldsObject(registerDto);
        let { username, password } = registerDto
        await this.userService.checkExistUser(username);
        const isEmptyDb = await this.userRepository.findOneBy({});
        let roleName = ROLES.USER;
        if (!isEmptyDb) roleName = ROLES.ADMIN;
        password = hashSync(password, AuthEnum.SALT_PASS);
        const user = this.userRepository.create({
            username,
            password,
        });
        if (!user.role) user.role = [];
        user.role.push(roleName)
        return await this.userRepository.save(user)
    }
    async login(loginDto: LoginDto) {
        loginDto = removeEmptyFieldsObject(loginDto)
        const { username, password } = loginDto
        const user = await this.userService.findUserByUsername(username);
        if (compareSync(password, user.password)) {
            user.access_token = this.signAccess_tokenJwt({ id: user.id })
            user.refresh_token = this.signRefresh_tokenJwt({ id: user.id })
            await this.userRepository.save(user);
            return {
                access_token: user.access_token,
                refresh_token: user.refresh_token,
                role: user.role,
                user,
            }
        }
    }
    signAccess_tokenJwt(payload: JwtPayloadDto) {
        return this.jwtService.sign(payload, { expiresIn: AuthEnum.ACCESS_TOKEN_EXPIRERS, secret: process.env.ACCESS_TOKEN_SECRET });
    }
    signRefresh_tokenJwt(payload: JwtPayloadDto) {
        return this.jwtService.sign(payload, { expiresIn: AuthEnum.REFRESH_TOKEN_EXPIRERS, secret: process.env.REFRESH_TOKEN_SECRET });
    }
    extractTokenAsBearer(bearerToken: string) {
        const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
        if (!token || !bearer) throw new UnauthorizedException(AuthMessages.Login);
        if (bearer?.toLowerCase() !== 'bearer') throw new UnauthorizedException(AuthMessages.Login);
        return token;
    }
    getTokenFromRequestAsBearer(req: Request) {
        const token: string | undefined = req?.headers?.authorization;
        return this.extractTokenAsBearer(token);
    }
    getTokenFromRequestAsCookie(req: Request) {
        const headerCookies: any = parse(req?.headers?.cookie);
        const bearerToken = req?.headers?.authorization;
        const [bearer, token] = bearerToken?.split(' ') || [undefined, undefined];
        const accessToken: string | undefined = req?.signedCookies?.access_token ?? req?.cookies?.access_token ?? headerCookies?.access_token ?? token ?? null;
        return accessToken
    }
    getRefreshTokenFromRequestAsCookie(req: Request) {
        const headerCookies: any = parse(req.headers.cookie);
        const token: string | undefined = req?.signedCookies?.refresh_token ?? req?.cookies?.refresh_token ?? headerCookies?.refresh_token;
        return token
    }
    async verifyAccessToken(token: string): Promise<any> {
        try {
            const { ACCESS_TOKEN_SECRET: secret } = process.env;
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            return JwtError.Expires

        }
    }
    async verifyRefreshTokenJwt(token: string): Promise<any> {
        try {
            const { REFRESH_TOKEN_SECRET: secret } = process.env;
            return this.jwtService.verify(token, { secret });
        } catch (error) {
            return JwtError.Expires
        }
    }
}
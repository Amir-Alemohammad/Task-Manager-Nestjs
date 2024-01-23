import { Body, Controller, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { AuthMessages } from "./enum/auth.message";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { SwaggerConsumes } from "../../common/enum/swagger.enum";
import { setAuthCookies } from "../../common/utils/auth-cookie.util";
import { Request, Response } from "express";

@Controller('auth')
@ApiTags("Authorization")
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }
    @Post('register')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async register(@Body() registerDto: RegisterDto) {
        await this.authService.register(registerDto);
        return {
            statusCode: HttpStatus.OK,
            message: AuthMessages.SuccessRegister,
        }
    }
    @Post('login')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async login(@Body() loginDto: LoginDto, @Res() res: Response, @Req() req: Request) {
        const { access_token, refresh_token, role, user } = await this.authService.login(loginDto)
        await setAuthCookies(req, res, user, { access_token, refresh_token, role })
        return {
            access_token,
            refresh_token,
            role,
            message: AuthMessages.SuccessLogin,
        }
    }
}
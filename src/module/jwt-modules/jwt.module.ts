import { Global, Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { config } from "dotenv";
import { join } from "path";
import { JwtStrategy } from "../auth/strategy/jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
config({
    path: join(process.cwd(), `.env`)
})
@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.ACCESS_TOKEN_SECRET,
            signOptions: {
                expiresIn: '1w',
            }
        }),
        TypeOrmModule.forFeature([UserEntity])
    ],
    providers: [JwtService, JwtStrategy],
    exports: [JwtService]
})
export class CustomJWTModule { }
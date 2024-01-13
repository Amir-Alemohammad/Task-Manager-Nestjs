import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { RolesService } from "../RBAC/service/roles.service";
import { RolesEntity } from "../RBAC/entities/roles.entity";
import { PermissionEntity } from "../RBAC/entities/permission.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RolesEntity, PermissionEntity])
    ],
    controllers: [UserController],
    providers: [UserService, AuthService, RolesService],
})
export class UserModule { }
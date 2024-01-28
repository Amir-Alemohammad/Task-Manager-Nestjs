import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { RolesService } from "../RBAC/service/roles.service";
import { RolesEntity } from "../RBAC/entities/roles.entity";
import { PermissionEntity } from "../RBAC/entities/permission.entity";
import { PermissionService } from "../RBAC/service/permission.service";
import { PermissionSeeder } from "../seed/data/permission.seeder";
import { RoleSeeder } from "../seed/data/role.seeder";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RolesEntity, PermissionEntity])
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, RolesService, PermissionService, PermissionSeeder, RoleSeeder],
})
export class AuthModule { }
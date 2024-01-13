import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RolesEntity } from "./entities/roles.entity";
import { PermissionEntity } from "./entities/permission.entity";
import { RolesController } from "./controller/roles.controller";
import { PermissionController } from "./controller/permission.controller";
import { RolesService } from "./service/roles.service";
import { UserEntity } from "../user/entities/user.entity";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";
import { PermissionService } from "./service/permission.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([RolesEntity, PermissionEntity, UserEntity]),
    ],
    controllers: [RolesController, PermissionController],
    providers: [RolesService, PermissionService, AuthService, UserService],
})
export class RbacModule { }
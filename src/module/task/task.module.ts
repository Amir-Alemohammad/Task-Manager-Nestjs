import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthService } from "../auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "./entities/task.entity";
import { TaskController } from "./task.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { RolesEntity } from "../RBAC/entities/roles.entity";
import { PermissionEntity } from "../RBAC/entities/permission.entity";
import { RolesService } from "../RBAC/service/roles.service";
import { PermissionService } from "../RBAC/service/permission.service";
import { PermissionSeeder } from "../seed/data/permission.seeder";
import { RoleSeeder } from "../seed/data/role.seeder";

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, UserEntity, RolesEntity, PermissionEntity])
    ],
    controllers: [TaskController],
    providers: [TaskService, AuthService, UserService, RolesService, PermissionService, PermissionSeeder, RoleSeeder]
})
export class TaskModule { }
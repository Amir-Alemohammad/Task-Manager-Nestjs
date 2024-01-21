import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hashSync } from "bcrypt";
import { AuthEnum } from "src/common/enum/auth.enum";
import { TPermission, TRoles, TUser } from "src/common/types/public.type";
import { userConfig } from "src/config/user.config";
import { PermissionService } from "src/module/RBAC/service/permission.service";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Repository } from "typeorm";
import { RoleSeeder } from "./role.seeder";

@Injectable()
export class PermissionSeeder {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly permissionService: PermissionService,
        private readonly roleSeeder: RoleSeeder,
    ) { }
    async seed(user: TUser, permissionData: TPermission[], roleData: TRoles[]) {
        const userData: TUser = userConfig();
        if (!user) {
            userData.password = hashSync(userData.password, AuthEnum.SALT_PASS);
            for (const dataOfPermission of permissionData) {
                console.log(dataOfPermission.slug)
                const existPermission = await this.permissionService.findBySlug(dataOfPermission.slug)
                console.log(existPermission)
                if (existPermission) {
                    await this.permissionService.assignPermission(existPermission, dataOfPermission)
                    await this.roleSeeder.seedWithoutUser(userData, roleData, existPermission.id)
                } else {
                    const permission = await this.permissionService.create(dataOfPermission)
                    await this.roleSeeder.seedWithoutUser(userData, roleData, permission.id)
                }
            }
        } else {
            for (const dataOfPermission of permissionData) {
                const permission = await this.permissionService.findBySlug(dataOfPermission.slug);
                if (!permission) {
                    const newPermission = await this.permissionService.create(dataOfPermission);
                    await this.roleSeeder.seedUser(user, roleData, newPermission.id);
                } else {
                    await this.permissionService.assignPermission(permission, dataOfPermission);
                    await this.roleSeeder.seedUser(user, roleData, permission.id);
                }
                await this.userRepository.save(user);
                break;
            }
        }
    }
}
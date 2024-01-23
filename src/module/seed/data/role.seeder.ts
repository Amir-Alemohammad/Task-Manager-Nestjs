import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TRoles, TUser } from "../../../common/types/public.type";
import { RolesEntity } from "../../../module/RBAC/entities/roles.entity";
import { RolesService } from "../../../module/RBAC/service/roles.service";
import { UserEntity } from "../../../module/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class RoleSeeder {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(RolesEntity) private readonly roleRepository: Repository<RolesEntity>,
        private readonly rolesService: RolesService,
    ) { }
    async seedWithoutUser(userData: TUser, roleData: TRoles[], permissionId: number) {
        const newUser = this.userRepository.create(userData);
        for (const dataOfRoles of roleData) {
            const existRole = await this.rolesService.findRoleByName(dataOfRoles.name);
            if (existRole) {
                await this.rolesService.assignRole(existRole, dataOfRoles);
                break;
            }
            const role = await this.rolesService.create(dataOfRoles, permissionId);
            newUser.roles = [];
            newUser.role = [];
            newUser.role.push(role.name)
            newUser.roles.push(role)
            await this.roleRepository.save(role)
        }
        await this.userRepository.save(newUser)
    }
    async seedUser(user: TUser, roleData: TRoles[], permissionId: number) {
        for (const dataOfRoles of roleData) {
            const role = await this.rolesService.findRoleByName(dataOfRoles.name);
            if (!role) {
                const newRole = await this.rolesService.create(dataOfRoles, permissionId)
                user.role.push(newRole.name);
                user.roles.push(newRole);
            } else {
                await this.rolesService.assignRole(role, dataOfRoles);
                user.role.push(role.name)
                user.roles.push(role);
            }
        }
    }
}
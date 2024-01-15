import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ISeeder } from "../interface/seeder.interface";
import { UserEntity } from "../../user/entities/user.entity";
import { RolesEntity } from "src/module/RBAC/entities/roles.entity";
import { PermissionEntity } from "src/module/RBAC/entities/permission.entity";
import { hashSync } from "bcrypt";
import { AuthEnum } from "src/common/enum/auth.enum";
import slugify from "slugify";
import { EntityName } from "src/common/enum/entity.enum";

@Injectable()
export class UsersSeeder implements ISeeder {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
        @InjectRepository(RolesEntity) private readonly roleRepository: Repository<RolesEntity>,
    ) { }

    async seed() {
        const userData: Partial<UserEntity>[] = [];
        const roleData: Partial<RolesEntity>[] = [];
        const permissionData: Partial<PermissionEntity>[] = [];


        userData.push({
            username: '09391036095',
            password: 'admin',
        });
        permissionData.push({
            name: 'manage users',
            description: 'can create users change',
            slug: 'manage users',
        })
        for (const data of userData) {
            const user = await this.userRepository.createQueryBuilder(EntityName.USER)
                .leftJoinAndSelect('user.roles', 'roles')
                .leftJoinAndSelect('roles.permissions', 'permissions')
                .where([
                    { username: data.username },
                ])
                .getOne()
            if (!user) {
                data.password = hashSync(data.password, AuthEnum.SALT_PASS);
                for (const dataOfPermission of permissionData) {
                    dataOfPermission.slug = slugify(dataOfPermission.slug)
                    const existPermission = await this.permissionRepository.findOne({
                        where: { slug: dataOfPermission.slug }
                    });
                    if (existPermission) {
                        Object.assign(existPermission, dataOfPermission);
                        await this.permissionRepository.save(existPermission);
                    };
                    const newUser = this.userRepository.create(data)
                    const permission = this.permissionRepository.create(dataOfPermission)
                    await this.permissionRepository.save(permission)
                    const permissions = await this.permissionRepository.findBy({ id: permission.id });
                    roleData.push({
                        name: 'admin',
                        description: 'admin role',
                        permissions: permissions,
                    })
                    for (const dataOfRoles of roleData) {
                        const existRole = await this.roleRepository.findOne({
                            where: { name: dataOfRoles.name }
                        });
                        if (existRole) {
                            Object.assign(existRole, dataOfRoles);
                            await this.roleRepository.save(existRole);
                            break;
                        }
                        const role = this.roleRepository.create(dataOfRoles);
                        newUser.roles = [];
                        newUser.role = [];
                        newUser.role.push(role.name)
                        newUser.roles.push(role)
                        await this.roleRepository.save(role)
                    }
                    await this.userRepository.save(newUser)
                }
            } else {
                for (const dataOfPermission of permissionData) {
                    const permissions = await this.permissionRepository.findBy({ slug: dataOfPermission.slug });
                    if (permissions.length <= 0) {
                        const newPermission = this.permissionRepository.create(dataOfPermission);
                        await this.permissionRepository.save(newPermission);
                        const permissions = await this.permissionRepository.findBy({ slug: newPermission.slug });
                        roleData.push({
                            name: 'admin',
                            description: 'admin role update',
                            permissions,
                        })
                    } else {
                        roleData.push({
                            name: 'admin',
                            description: 'admin role',
                            permissions,
                        });
                        for (const permission of permissions) {
                            dataOfPermission.slug = slugify(dataOfPermission.slug)
                            Object.assign(permission, dataOfPermission);
                            await this.permissionRepository.save(permission);
                        }
                        for (const dataOfRoles of roleData) {
                            const role = await this.roleRepository.findOne({ where: { name: dataOfRoles.name } })
                            if (!role) {
                                const newRole = this.roleRepository.create(dataOfRoles);
                                await this.roleRepository.save(newRole);
                                user.role.push(newRole.name);
                                user.roles.push(newRole);
                            } else {
                                Object.assign(role, dataOfRoles);
                                await this.roleRepository.save(role);
                                user.role = [role.name];
                                user.roles = [role];
                            }
                        }
                    }
                    await this.userRepository.save(user);
                    break;
                }
            }
        }
    }
}

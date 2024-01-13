import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolesEntity } from "../entities/roles.entity";
import { Like, Repository } from "typeorm";
import { PermissionEntity } from "../entities/permission.entity";
import { CreateRolesDto, UpdateRoleDto } from "../dto/roles.dto";
import { PermissionService } from "./permission.service";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/function.util";
import { PermissionMessage, RolesMessage } from "../enum/message.enum";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolesEntity) private readonly rolesRepository: Repository<RolesEntity>,
        @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
    ) { }
    async create(createRoleDto: CreateRolesDto, permissionId: number) {
        const { name, description } = createRoleDto;
        // const permission = await this.permissionService.findOne(permissionId);
        const permissions = await this.permissionRepository.findBy({ id: permissionId });
        const role = this.rolesRepository.create({
            name,
            description,
            permissions,
        })
        await this.rolesRepository.save(role);
    }
    async findAll(paginationDto: PaginationDto, sortDto: SortDto, searchTerm: string) {
        const { limit, skip, page } = paginationSolver(+paginationDto.page, +paginationDto.limit)
        searchTerm = searchTerm ? searchTerm.toLocaleLowerCase() : '';
        // const [roles, count] = await this.rolesRepository.createQueryBuilder()
        //     .where([
        //         { name: Like(`%${searchTerm}%`) },
        //     ])
        //     .take(limit)
        //     .skip(skip)
        //     .getManyAndCount()
        const [roles, count] = await this.rolesRepository.findAndCount({
            where: [
                { name: Like(`%${searchTerm}%`) },
            ],
            relations: ['permissions'],
            take: limit,
            skip,
        })
        return {
            pagination: paginationGenerator(count, page, limit),
            roles,
        }
    }
    async update(id: number, updateRoleDto: UpdateRoleDto) {
        let { name, description, permissionId } = updateRoleDto;
        const role = await this.findOne(id);
        if (!name) name = role.name;
        if (!description) description = role.description;
        if (permissionId) {
            const permissions = await this.permissionRepository.findBy({ id: permissionId });
            role.permissions = permissions;
        } else {
            const permission = role.permissions;
            role.permissions = permission;
        }
        Object.assign(role, { name, description })
        await this.rolesRepository.save(role)
    }
    async findOne(id: number) {
        const role = await this.rolesRepository.findOne({
            where: { id },
            relations: ['permissions'],
        })
        if (!role) throw new BadRequestException(RolesMessage.NotFound);
        return role
    }
    async saveRole(role: RolesEntity) {
        await this.rolesRepository.save(role);
    }
    async checkExistByName(name: string) {
        const roles = await this.rolesRepository.findBy({ name });
        if (!roles) throw new BadRequestException(RolesMessage.NotFound);
        return roles
    }
    async remove(id: number) {
        const role = await this.findOne(id);
        if (role.permissions && role.permissions.length > 0) {
            for (const permission of role.permissions) {
                let rolePermission = await this.permissionRepository.findOne({
                    where: { id: permission.id },
                    relations: ['roles']
                })
                if (!rolePermission) throw new BadRequestException(PermissionMessage.NotFound)
                rolePermission.roles = rolePermission.roles.filter(item => { item });
                await this.permissionRepository.save(rolePermission);
            }
        }
        return await this.rolesRepository.delete(id)
    }
}
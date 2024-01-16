import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntity } from "../entities/permission.entity";
import { Like, Repository } from "typeorm";
import { CreatePermissionDto, UpdatePermissionDto } from "../dto/permission.dto";
import slugify from "slugify";
import { PermissionMessage } from "../enum/message.enum";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";
import { paginationGenerator, paginationSolver } from "src/common/utils/function.util";
import { RolesService } from "./roles.service";
import { TPermission } from "src/common/types/public.type";

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
        private readonly rolesService: RolesService,
    ) { }
    async create(createPermissionDto: CreatePermissionDto) {
        let { name, description, slug } = createPermissionDto;
        slug = slugify(slug);
        const permission = this.permissionRepository.create({ name, description, slug, roles: [] });
        return await this.permissionRepository.save(permission)
    }
    async update(id: number, updatePermissionDto: UpdatePermissionDto) {
        let { name, description, slug } = updatePermissionDto;
        const permission = await this.findOne(id);
        if (!name) name = permission.name;
        if (!description) description = permission.description;
        if (!slug) slug = permission.slug;
        slug = slugify(slug);
        Object.assign(permission, { name, description, slug })
        return await this.permissionRepository.save(permission);
    }
    async findAll(paginationDto: PaginationDto, sortDto: SortDto, searchTerm: string) {
        const { limit, skip, page } = paginationSolver(+paginationDto.page, +paginationDto.limit)
        searchTerm = searchTerm ? searchTerm.toLocaleLowerCase() : '';
        const [permissions, count] = await this.permissionRepository.createQueryBuilder()
            // .leftJoinAndSelect('permission.roles', 'roles')
            .where([
                { name: Like(`%${searchTerm}%`) },
                { slug: Like(`%${searchTerm}%`) },
            ])
            .take(limit)
            .skip(skip)
            .getManyAndCount()
        return {
            pagination: paginationGenerator(count, page, limit),
            permissions,
        }
    }
    async findOne(id: number) {
        const permission = await this.permissionRepository.findOne({
            where: { id },
            relations: ['roles']
        })
        if (!permission) throw new NotFoundException(PermissionMessage.NotFound)
        return permission
    }
    async remove(id: number) {
        const permission = await this.findOne(id);
        if (permission.roles && permission.roles.length > 0) {
            for (const role of permission.roles) {
                let permissionRole = await this.rolesService.findOne(role.id)
                permissionRole.permissions = permissionRole.permissions.filter(item => { item });
                await this.rolesService.saveRole(permissionRole);
            }
        }
        await this.permissionRepository.delete(id)
    }
    async findBySlug(slug: string) {
        const permission = this.permissionRepository.findOne({
            where: { slug }
        });
        return permission;
    }
    async findPermissions(id: number) {
        const permissions = await this.permissionRepository.findBy({ id });
        return permissions;
    }
    async findPermissionsBySlug(slug: string) {
        const permissions = await this.permissionRepository.findBy({ slug });
        return permissions;
    }
    async assignPermission(permission: TPermission, data: TPermission) {
        data.slug = slugify(data.slug)
        Object.assign(permission, data);
        await this.permissionRepository.save(permission);
    }
}
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Like, Repository } from "typeorm";
import { RegisterDto } from "../auth/dto/register.dto";
import { paginationGenerator, paginationSolver, removeEmptyFieldsObject } from "../../common/utils/function.util";
import { AuthMessages } from "../auth/enum/auth.message";
import { ROLES } from "../../common/enum/roles.enum";
import { compareSync, hashSync } from "bcrypt";
import { AuthEnum } from "../../common/enum/auth.enum";
import { PaginationDto } from "../../common/dtos/pagination.dto";
import { SortDto } from "../../common/dtos/sortable.dto";
import { EntityName } from "../../common/enum/entity.enum";
import { UserMessage } from "./enum/message.enum";
import { Request } from "express";
import { RolesService } from "../RBAC/service/roles.service";
import { TPermission, TRoles } from "src/common/types/public.type";
import { rolesConfig } from "src/config/roles.config";
import { permissionConfig } from "src/config/permission.config";
import { PermissionSeeder } from "../seed/data/permission.seeder";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly rolesService: RolesService,
        private readonly permissionSeeder: PermissionSeeder,
    ) { }
    async create(createUserDto: RegisterDto) {
        createUserDto = removeEmptyFieldsObject(createUserDto);
        let { username, password } = createUserDto
        const roleData: TRoles[] = rolesConfig();
        const permissionData: TPermission[] = permissionConfig();
        await this.checkExistUser(username);
        password = hashSync(password, AuthEnum.SALT_PASS);
        const user = this.userRepository.create({
            username,
            password,
        });
        const isEmptyDb = await this.userRepository.findOneBy({});
        if (!isEmptyDb) {
            await this.permissionSeeder.seed(user, permissionData, roleData);
        } else user.role.push(ROLES.USER);
        await this.userRepository.save(user)
    }
    async checkExistUser(username: string) {
        const user = await this.userRepository.findOneBy({ username })
        if (user) throw new BadRequestException(AuthMessages.AlreadyExistUser)
    }
    async findUserByUsername(username: string) {
        const user = await this.userRepository.findOneBy({ username })
        if (!user) throw new NotFoundException(AuthMessages.NotFoundAccount)
        return user;
    }
    async findUserById(id: number) {
        console.log(id)
        const user = await this.userRepository.createQueryBuilder(EntityName.USER)
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .where([
                { id }
            ])
            .getOne()
        if (!user) throw new NotFoundException(AuthMessages.NotFoundAccount)
        return user;
    }
    async findAll(paginationDto: PaginationDto, sortDto: SortDto, searchTerm: string) {
        const { limit, skip, page } = paginationSolver(+paginationDto.page, +paginationDto.limit)
        searchTerm = searchTerm ? searchTerm.toLocaleLowerCase() : '';
        const [users, count] = await this.userRepository.createQueryBuilder(EntityName.USER)
            .leftJoin('user.tasks', 'tasks')
            .leftJoin('user.roles', 'roles')
            .addSelect(['tasks.id', 'roles.id', 'roles.name', 'roles.description', 'tasks.image', 'tasks.name', 'tasks.priority', 'tasks.created_at'])
            .where([
                { username: Like(`%${searchTerm}%`) }
            ])
            .skip(skip)
            .take(limit)
            .orderBy('user.id', 'ASC')
            .getManyAndCount()
        return {
            pagination: paginationGenerator(count, page, limit),
            users
        }
    }
    async update(id: number, updateUserDto: RegisterDto) {
        let { username, password } = updateUserDto;
        const user = await this.findUserById(id);
        if (compareSync(password, user.password)) {
            password = hashSync(password, AuthEnum.SALT_PASS);
            Object.assign(user, {
                username,
                password
            })
            return await this.userRepository.save(user);
        }
        throw new BadRequestException(UserMessage.ConflictPassword)
    }
    async remove(id: number, request: Request) {
        const user = await this.findUserById(id);
        const ownUserId = request.user.id;
        if (user.id === ownUserId) throw new BadRequestException(UserMessage.ConflictDelete)
        return await this.userRepository.remove(user);
    }
    async setRoleToUser(userId: number, roleName: string) {
        const user = await this.findUserById(userId)
        const roles = await this.rolesService.checkExistByName(roleName);
        for (const role of roles) {
            user.role.push(role.name);
            if (!user.roles) user.roles = [];
            user.roles.push(role)
        }
        await this.userRepository.save(user)
    }
    async getUserByUsername(username: string) {
        const user = await this.userRepository.createQueryBuilder(EntityName.USER)
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .where([
                { username },
            ])
            .getOne()
        return user;
    }
}
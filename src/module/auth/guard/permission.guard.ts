import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthMessages } from "../enum/auth.message";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../user/entities/user.entity";
import { Repository } from "typeorm";
import { EntityName } from "../../../common/enum/entity.enum";
import { PERMISSION_KEY } from "../../../common/decorators/permission.decorator";
import { Permissions } from "../../../common/enum/roles.enum";
import { hasPermission } from "../../../common/utils/function.util";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext) {
        const requiredPermissions = this.reflector.getAllAndOverride<Permissions[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredPermissions || requiredPermissions.length == 0) return true;
        const req: Request = context.switchToHttp().getRequest<Request>();
        const user = await this.userRepository.createQueryBuilder(EntityName.USER)
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .where([
                { id: req.user.id }
            ])
            .getOne()
        const permission = hasPermission(user, requiredPermissions);
        if (!permission) throw new ForbiddenException(AuthMessages.Forbidden)
        return permission;
    }
}
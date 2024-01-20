import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { AuthMessages } from "../enum/auth.message";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/module/user/entities/user.entity";
import { Repository } from "typeorm";
import { EntityName } from "src/common/enum/entity.enum";
import { PERMISSION_KEY } from "src/common/decorators/permission.decorator";
import { Permissions } from "src/common/enum/roles.enum";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext) {
        const requiredPermission = this.reflector.getAllAndOverride<Permissions[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        const req: Request = context.switchToHttp().getRequest<Request>();
        const user = await this.userRepository.createQueryBuilder(EntityName.USER)
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .where([
                { id: req.user.id }
            ])
            .getOne()
        user.roles.forEach(role => {
            for (const userPermission of role.permissions) {
                const accessResult = requiredPermission.some(permission => userPermission.slug.includes(permission));
                if (!accessResult) throw new ForbiddenException(AuthMessages.Forbidden);
                if (!requiredPermission || requiredPermission.length == 0) return true;
                return accessResult;
            }
        });
        return true;
    }
}
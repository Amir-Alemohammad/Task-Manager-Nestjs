import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "src/common/decorators/role.decorator";
import { ROLES } from "src/common/enum/roles.enum";
import { AuthMessages } from "../enum/auth.message";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }
    async canActivate(context: ExecutionContext) {
        const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        const req: Request = context.switchToHttp().getRequest<Request>();
        const user = req?.user;
        const userRole = user?.role;
        if (!requiredRoles || requiredRoles.length == 0) return true;
        const accessResult = requiredRoles.some(role => userRole.includes(role));
        if (accessResult) return accessResult;
        throw new ForbiddenException(AuthMessages.Forbidden);
    }
}
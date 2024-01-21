import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import AddUserToRequestInterceptor from "../interceptors/AddUserToRequest.interceptor";
import { JwtAuthGuard } from "src/module/auth/guard/jwt.guard";
import { RoleGuard } from "src/module/auth/guard/role.guard";
import { PermissionGuard } from "src/module/auth/guard/permission.guard";


export function AuthDecorator() {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(JwtAuthGuard),
        UseGuards(PermissionGuard),
        UseGuards(RoleGuard),
        UseInterceptors(AddUserToRequestInterceptor),
    )
}
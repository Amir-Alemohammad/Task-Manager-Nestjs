import { Injectable } from "@nestjs/common";
import { ISeeder } from "../interface/seeder.interface";
import { TPermission, TRoles, TUser } from "src/common/types/public.type";
import { UserService } from "src/module/user/user.service";
import { permissionConfig } from "src/config/permission.config";
import { userConfig } from "src/config/user.config";
import { rolesConfig } from "src/config/roles.config";
import { PermissionSeeder } from "./permission.seeder";

@Injectable()
export class UsersSeeder implements ISeeder {
    constructor(
        private readonly userService: UserService,
        private readonly permissionSeeder: PermissionSeeder
    ) { }

    async seed() {
        const userData: TUser = userConfig();
        const permissionData: TPermission[] = permissionConfig();
        const roleData: TRoles[] = rolesConfig();
        const user = await this.userService.getUserByUsername(userData.username)
        await this.permissionSeeder.seed(user, permissionData, roleData);
    }
}

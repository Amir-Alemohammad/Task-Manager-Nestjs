import { SetMetadata } from "@nestjs/common";
import { Permissions } from "../enum/roles.enum";

export const PERMISSION_KEY = 'permissions'
export const checkPermissions = (...permissions: Permissions[]) => SetMetadata(PERMISSION_KEY, permissions);
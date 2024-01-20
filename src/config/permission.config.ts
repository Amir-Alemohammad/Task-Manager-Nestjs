import { Permissions } from "src/common/enum/roles.enum";

export const permissionConfig = () => [
    {
        name: 'user',
        description: 'users',
        slug: Permissions.Manager
    },
]
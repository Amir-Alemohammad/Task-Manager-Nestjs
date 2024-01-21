import { Permissions } from "src/common/enum/roles.enum";

export const permissionConfig = () => [
    {
        name: 'admin',
        description: 'admin',
        slug: Permissions.Admin
    },
]
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "../services/seed.service";
import { Module } from "@nestjs/common";
import { UserEntity } from "../../user/entities/user.entity";
import { TaskEntity } from "../../task/entities/task.entity";
import { RolesEntity } from "../../RBAC/entities/roles.entity";
import { PermissionEntity } from "../../RBAC/entities/permission.entity";
import { TypeOrmDataSourceConfig } from "src/config/typeorm.config";
import { UsersSeeder } from "../data/users.seeder";

@Module({
    imports: [
        TypeOrmModule.forRoot(TypeOrmDataSourceConfig),
        TypeOrmModule.forFeature([
            UserEntity,
            TaskEntity,
            RolesEntity,
            PermissionEntity,
        ]),
    ],
    controllers: [],
    providers: [
        SeedService,
        UsersSeeder,
    ],
})
export class SeedModule {

}

import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { config } from "dotenv";
import { PermissionEntity } from "src/module/RBAC/entities/permission.entity";
import { RolesEntity } from "src/module/RBAC/entities/roles.entity";
import { TaskEntity } from "src/module/task/entities/task.entity";
import { UserEntity } from "src/module/user/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

config()
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;
// export function TypeOrmConfig(): TypeOrmModuleOptions {
//     console.log({ DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT: +DB_PORT, DB_USERNAME });
//     return {
//         type: "mysql",
//         host: DB_HOST,
//         port: +DB_PORT,
//         username: DB_USERNAME,
//         password: DB_PASSWORD,
//         database: DB_NAME,
//         autoLoadEntities: true,
//         synchronize: true,
//         entities: ['dist/**/**/**/*.entity{.ts,.js}', 'dist/**/**/*.entity{.ts,.js}'],
//     }
// }
export const TypeOrmDataSourceConfig: DataSourceOptions = {
    type: "mysql",
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    // synchronize: false,
    entities: [UserEntity, TaskEntity, PermissionEntity, RolesEntity],
    // migrationsRun: true,
    migrations: ['src/migrations/*{.ts,.js}'],
}
console.log({ DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT: +DB_PORT, DB_USERNAME });
export const dataSource = new DataSource(TypeOrmDataSourceConfig);
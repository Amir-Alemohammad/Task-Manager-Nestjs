import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UserEntity } from "../../user/entities/user.entity";
import { TypeOrmDataSourceConfig } from "src/config/typeorm.config";
import { SeedTestService } from "../services/seed-test.service";
import { UsersTestSeeder } from "../data/users-test.seeder";

@Module({
    imports: [
        TypeOrmModule.forRoot(TypeOrmDataSourceConfig),
        TypeOrmModule.forFeature([
            UserEntity,
        ]),
    ],
    controllers: [],
    providers: [
        SeedTestService,
        UsersTestSeeder,
    ],
})
export class SeedTestModule { }

import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { AuthService } from "../auth/auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TaskEntity } from "./entities/task.entity";
import { TaskController } from "./task.controller";
import { UserEntity } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([TaskEntity, UserEntity])
    ],
    controllers: [TaskController],
    providers: [TaskService, AuthService, UserService]
})
export class TaskModule { }
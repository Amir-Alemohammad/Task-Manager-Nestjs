import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Promise as Bluebird } from "bluebird";
import { faker } from "@faker-js/faker";
import { ISeeder } from "./interface/seeder.interface";
import { UserEntity } from "../user/entities/user.entity";

@Injectable()
export class UsersSeeder implements ISeeder {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async seed() {
        const data: Partial<UserEntity>[] = [];

        for (let i = 0; i < 10; i++) {
            data.push({
                username: faker.internet.userName(),
                password: faker.internet.password(),
            });
        }

        await Bluebird.each(data, async data => {
            await this.userRepository.insert(data);
        })
    }
}

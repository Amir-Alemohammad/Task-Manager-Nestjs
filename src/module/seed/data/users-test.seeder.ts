import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ISeeder } from "../interface/seeder.interface";
import { UserEntity } from "../../user/entities/user.entity";
import { faker } from "@faker-js/faker";
import * as Bluebird from 'bluebird';

@Injectable()
export class UsersTestSeeder implements ISeeder {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    ) { }

    async seed() {
        const userData: Partial<UserEntity>[] = [];
        for (let i = 0; i < 3; i++) {
            userData.push({
                username: faker.internet.userName(),
                password: faker.internet.password(),
            });
        }
        await Bluebird.each(userData, async data => {
            await this.userRepository.insert(data);
        })
    }
}

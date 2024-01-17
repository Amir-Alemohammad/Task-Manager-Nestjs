import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { DataSource } from "typeorm";
import { ISeeder } from '../interface/seeder.interface';
import { UsersTestSeeder } from '../data/users-test.seeder';

@Injectable()
export class SeedTestService {
    private readonly seeders: ISeeder[] = [];
    private readonly logger = new Logger(SeedTestService.name);
    constructor(
        private readonly connection: DataSource,
        private readonly usersTestSeeder: UsersTestSeeder,
    ) {
        this.seeders = [
            this.usersTestSeeder,
        ];
    }
    async seed() {
        await this.connection.synchronize(true);
        await Bluebird.each(this.seeders, async (seeder: ISeeder) => {
            this.logger.log(`Seeding ${seeder.constructor.name}`);
            await seeder.seed();
        });
    }
}


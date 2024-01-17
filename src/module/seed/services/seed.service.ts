import { Injectable, Logger } from '@nestjs/common';
import { Promise as Bluebird } from 'bluebird';
import { DataSource } from "typeorm";
import { ISeeder } from '../interface/seeder.interface';
import { UsersSeeder } from '../data/users.seeder';

@Injectable()
export class SeedService {
    private readonly seeders: ISeeder[] = [];
    private readonly logger = new Logger(SeedService.name);
    constructor(
        private readonly connection: DataSource,
        private readonly usersSeeder: UsersSeeder,
    ) {
        this.seeders = [
            this.usersSeeder,
        ];
    }
    async seed() {
        await this.connection.synchronize(false);

        await Bluebird.each(this.seeders, async (seeder: ISeeder) => {
            this.logger.log(`Seeding ${seeder.constructor.name}`);
            await seeder.seed();
        });
    }
}


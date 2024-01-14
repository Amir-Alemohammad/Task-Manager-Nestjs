import { NestFactory } from '@nestjs/core';
import { SeedModule } from './module/seed/seed.module';
import { SeedService } from './module/seed/seed.service';

async function bootstrap() {
    const app = await NestFactory.create(SeedModule);
    const seeder = app.get(SeedService);
    await seeder.seed();
    await app.close();
}
bootstrap();

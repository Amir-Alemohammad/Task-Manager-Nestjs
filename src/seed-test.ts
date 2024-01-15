import { NestFactory } from '@nestjs/core';
import { SeedTestService } from './module/seed/services/seed-test.service';
import { SeedTestModule } from './module/seed/modules/seed-test.module';

async function bootstrap() {
    const app = await NestFactory.create(SeedTestModule);
    const seederTest = app.get(SeedTestService);
    await seederTest.seed();
    await app.close();
}
bootstrap();

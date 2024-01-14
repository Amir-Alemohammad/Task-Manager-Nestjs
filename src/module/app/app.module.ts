import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmDataSourceConfig } from 'src/config/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { CustomJWTModule } from '../jwt-modules/jwt.module';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';
import { RbacModule } from '../RBAC/rbac.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), `.env`),
    }),
    TypeOrmModule.forRoot(TypeOrmDataSourceConfig),
    // TypeOrmModule.forRoot(TypeOrmConfig()),
    CustomJWTModule,
    AuthModule,
    UserModule,
    TaskModule,
    RbacModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { userConfig } from '../src/config/user.config'
import * as request from 'supertest';
import { TUser } from "../src/common/types/public.type";
import { AppModule } from "../src/module/app/app.module";

describe('UserController (e2e)', () => {
    let app: INestApplication;
    const userData: TUser = userConfig();
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Creating New User (POST) user/create-new-user', () => {
        it('/user/create-new-user (POST)', () => {
            return request(app.getHttpServer())
                .post('/user/create-new-user')
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(201)
        });
        it('should return a 400 when user exist', () => {
            return request(app.getHttpServer())
                .post('/user/create-new-user')
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(400)
        });
    });

})
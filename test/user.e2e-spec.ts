import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing";
import { userConfig } from '../src/config/user.config'
import * as request from 'supertest';
import { TUser } from "../src/common/types/public.type";
import { AppModule } from "../src/module/app/app.module";
import * as cookieParser from 'cookie-parser';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    const userData: TUser = userConfig();
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = moduleFixture.createNestApplication();
        app.use(cookieParser(process.env.COOKIE_SECRET));
        await app.init();
    });

    describe('Creating New User (POST) user/create-new-user', () => {
        let cookie = '';
        it('should login', (done) => {
            request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(201)
                .end((err, res) => {
                    cookie = res.headers['set-cookie'];
                    done()
                })
        });
        it('/user/create-new-user (POST)', () => {
            return request(app.getHttpServer())
                .post('/user/create-new-user')
                .set('Cookie', cookie)
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(201)
        });
        it('should return a 400 when user exist', () => {
            return request(app.getHttpServer())
                .post('/user/create-new-user')
                .set('Cookie', cookie)
                .send({
                    username: userData.username,
                    password: userData.password,
                })
                .expect(400)
        });
    });

})
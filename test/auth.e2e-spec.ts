import { INestApplication } from "@nestjs/common";
import { TUser } from "../src/common/types/public.type";
import { userConfig } from "../src/config/user.config";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/module/app/app.module";
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
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
    describe('login user', () => {
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
        it('should return users', () => {
            return request(app.getHttpServer())
                .get('/user/list')
                .set('Cookie', cookie)
                .expect(200)
        })
    })
})
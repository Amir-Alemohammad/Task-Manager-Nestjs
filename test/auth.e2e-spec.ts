import { INestApplication } from "@nestjs/common";
import { TPermission, TRoles, TUser } from "../src/common/types/public.type";
import { userConfig } from "../src/config/user.config";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/module/app/app.module";
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { permissionConfig } from "../src/config/permission.config";
import { rolesConfig } from "../src/config/roles.config";

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    const userData: TUser = userConfig();
    const permissionData: TPermission[] = permissionConfig();
    const roleData: TRoles[] = rolesConfig();
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
        it('should create permission', () => {
            for (const data of permissionData) {
                return request(app.getHttpServer())
                    .post('/permission')
                    .send({
                        name: data.name,
                        description: data.description,
                        slug: data.slug,
                    })
                    .set('Cookie', cookie)
                    .expect(201);
            }
        })
        it('should create role', () => {
            for (const data of roleData) {
                return request(app.getHttpServer())
                    .post('/roles/3')
                    .send({
                        name: data.name,
                        description: data.description,
                    })
                    .set('Cookie', cookie)
                    .expect(201);
            }
        })
    })
})
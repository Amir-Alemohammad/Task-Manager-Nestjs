import { INestApplication } from "@nestjs/common";
import { TPermission, TRoles, TUser } from "../src/common/types/public.type";
import { userConfig } from "../src/config/user.config";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/module/app/app.module";
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { permissionConfig } from "../src/config/permission.config";
import { rolesConfig } from "../src/config/roles.co
import { getDbConnection } from "../src/common/utils/typeorm-connection.util";
import { DataSource, QueryRunner } from "typeorm";
import { RolesEntity } from "src/module/RBAC/entities/roles.entity";
import { PermissionEntity } from "src/module/RBAC/entities/permission.entity";
import { UserEntity } from "src/module/user/entities/user.entity";

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    const userData: TUser = userConfig();
    const permissionData: TPermission[] = permissionConfig();
    const roleData: TRoles[] = rolesConfig();
    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()
        app = moduleFixture.createNestApplication();
        app.use(cookieParser(process.env.COOKIE_SECRET));
        dataSource = await getDbConnection();
        await app.init();
    });
    afterAll(async () => {
        const rolesRepository = dataSource.getRepository(RolesEntity);
        const permissionRepository = dataSource.getRepository(PermissionEntity);
        const userRepository = dataSource.getRepository(UserEntity);
        const user = await userRepository.findOneBy({ username: userData.username });
        if (user) await userRepository.remove(user);
        for (const role of roleData) {
            const foundRole = await rolesRepository.findOneBy({ name: role.name });
            if (foundRole) await rolesRepository.remove(foundRole);
        }
        for (const permission of permissionData) {
            const foundPermission = await permissionRepository.findOneBy({ slug: permission.slug })
            if (foundPermission) await permissionRepository.remove(foundPermission);
        }
        await dataSource.destroy();
        await app.close();
    })
    describe('login user', () => {
        it('should create user', () => {
            return request(app.getHttpServer())
                .post('/user/create-new-user')
                .send({
                    username: userData.username,
                    password: userData.password
                })
                .expect(201)
        })
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
        // it('should create permission', () => {
        //     for (const data of permissionData) {
        //         return request(app.getHttpServer())
        //             .post('/permission')
        //             .send({
        //                 name: data.name,
        //                 description: data.description,
        //                 slug: data.slug,
        //             })
        //             .set('Cookie', cookie)
        //             .expect(201);
        //     }
        // })
        // it('should create role', () => {
        //     for (const data of roleData) {
        //         return request(app.getHttpServer())
        //             .post('/roles/3')
        //             .send({
        //                 name: data.name,
        //                 description: data.description,
        //             })
        //             .set('Cookie', cookie)
        //             .expect(201);
        //     }
        // })
})
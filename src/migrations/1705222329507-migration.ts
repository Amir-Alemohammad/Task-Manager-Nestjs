import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1705222329507 implements MigrationInterface {
    name = 'Migration1705222329507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`priority\` enum ('high', 'medium', 'low') NOT NULL DEFAULT 'low', \`image\` varchar(255) NOT NULL, \`userId\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`access_token\` varchar(255) NULL, \`refresh_token\` varchar(255) NULL, \`role\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`permission\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles_roles\` (\`userId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_0d0cc409255467b0ac4fe6b169\` (\`userId\`), INDEX \`IDX_7521d8491e7c51f885e9f861e0\` (\`rolesId\`), PRIMARY KEY (\`userId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles_permissions_permission\` (\`rolesId\` int NOT NULL, \`permissionId\` int NOT NULL, INDEX \`IDX_a740421f76d0df27723db697ae\` (\`rolesId\`), INDEX \`IDX_ea2b57117f371a484bc086819a\` (\`permissionId\`), PRIMARY KEY (\`rolesId\`, \`permissionId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`task\` ADD CONSTRAINT \`FK_f316d3fe53497d4d8a2957db8b9\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` ADD CONSTRAINT \`FK_0d0cc409255467b0ac4fe6b1693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` ADD CONSTRAINT \`FK_7521d8491e7c51f885e9f861e02\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` ADD CONSTRAINT \`FK_a740421f76d0df27723db697ae9\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` ADD CONSTRAINT \`FK_ea2b57117f371a484bc086819a8\` FOREIGN KEY (\`permissionId\`) REFERENCES \`permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` DROP FOREIGN KEY \`FK_ea2b57117f371a484bc086819a8\``);
        await queryRunner.query(`ALTER TABLE \`roles_permissions_permission\` DROP FOREIGN KEY \`FK_a740421f76d0df27723db697ae9\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` DROP FOREIGN KEY \`FK_7521d8491e7c51f885e9f861e02\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` DROP FOREIGN KEY \`FK_0d0cc409255467b0ac4fe6b1693\``);
        await queryRunner.query(`ALTER TABLE \`task\` DROP FOREIGN KEY \`FK_f316d3fe53497d4d8a2957db8b9\``);
        await queryRunner.query(`DROP INDEX \`IDX_ea2b57117f371a484bc086819a\` ON \`roles_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_a740421f76d0df27723db697ae\` ON \`roles_permissions_permission\``);
        await queryRunner.query(`DROP TABLE \`roles_permissions_permission\``);
        await queryRunner.query(`DROP INDEX \`IDX_7521d8491e7c51f885e9f861e0\` ON \`user_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d0cc409255467b0ac4fe6b169\` ON \`user_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP TABLE \`permission\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`task\``);
    }

}

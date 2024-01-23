import { EntityName } from "../../../common/enum/entity.enum";
import { UserEntity } from "../../../module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { PermissionEntity } from "./permission.entity";

@Entity(EntityName.Roles)
export class RolesEntity {
    @PrimaryGeneratedColumn('increment')
    id: number
    @Column()
    name: string;
    @Column()
    description: string;
    @ManyToMany(() => UserEntity, users => users.roles)
    users: UserEntity[];
    @ManyToMany(() => PermissionEntity, permission => permission.roles)
    @JoinTable()
    permissions: PermissionEntity[];
    @CreateDateColumn()
    created_at: Date;
}
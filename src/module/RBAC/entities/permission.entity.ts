import { EntityName } from "../../../common/enum/entity.enum";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { RolesEntity } from "./roles.entity";

@Entity(EntityName.Permission)
export class PermissionEntity {
    @PrimaryGeneratedColumn("increment")
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    slug: string;
    @ManyToMany(() => RolesEntity, roles => roles.permissions)
    roles: RolesEntity[];
    @CreateDateColumn()
    created_at: Date;
}
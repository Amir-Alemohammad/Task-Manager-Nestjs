import { EntityName } from "../../../common/enum/entity.enum";
import { RolesEntity } from "../../../module/RBAC/entities/roles.entity";
import { TaskEntity } from "../../../module/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity(EntityName.USER)
export class UserEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column({ nullable: true })
    access_token: string;
    @Column({ nullable: true })
    refresh_token: string;
    @Column({ type: "simple-array", nullable: true })
    role: string[];
    @OneToMany(() => TaskEntity, task => task.user)
    tasks: TaskEntity[];


    @ManyToMany(() => RolesEntity, roles => roles.users)
    @JoinTable()
    roles: RolesEntity[];

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
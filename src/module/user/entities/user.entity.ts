import { EntityName } from "src/common/enum/entity.enum";
import { ROLES } from "src/common/enum/roles.enum";
import { TaskEntity } from "src/module/task/entities/task.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    @Column({ default: ROLES.USER })
    role: string;
    @OneToMany(() => TaskEntity, task => task.user)
    tasks: TaskEntity[];
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
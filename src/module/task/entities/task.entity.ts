import { EntityName } from "../../../common/enum/entity.enum";
import { UserEntity } from "../../../module/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Priority } from "../enums/priority.enum";

@Entity(EntityName.Task)
export class TaskEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    name: string;
    @Column({ type: 'enum', enum: Priority, default: Priority.low })
    priority: Priority;
    @Column()
    image: string;
    @Column()
    userId: number
    @ManyToOne(() => UserEntity, user => user.tasks, { onDelete: 'CASCADE' })
    user: UserEntity
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}
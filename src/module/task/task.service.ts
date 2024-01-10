import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskEntity } from "./entities/task.entity";
import { Like, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create.dto";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";
import { UpdateTaskDto } from "./dto/update.dto";
import { MulterFile } from "src/common/types/public.type";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { paginationGenerator, paginationSolver, removeFileInPublic } from "src/common/utils/function.util";
import { EntityName } from "src/common/enum/entity.enum";
import { TaskMessage } from "./enums/message.enum";

@Injectable({ scope: Scope.REQUEST })
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>,
        @Inject(REQUEST) private readonly request: Request,
    ) { }
    /**
     * The function creates a new task with the provided data and saves it to the task repository.
     * @param {CreateTaskDto} createTaskDto - An object containing the data needed to create a task. It
     * has properties like `name` and `priority`.
     * @param {MulterFile} file - The `file` parameter is of type `MulterFile`. It represents the
     * uploaded file and contains information such as the file path, original name, size, and mimetype.
     * @returns the saved task.
     */
    async create(createTaskDto: CreateTaskDto, file: MulterFile) {
        const { name, priority } = createTaskDto
        const user = this.request.user;
        const image = file.path.replace(/\\/g, "/");
        const task = this.taskRepository.create({
            name,
            priority,
            userId: user.id,
            user,
            image
        });
        return await this.taskRepository.save(task)
    }
    async findAll(paginationDto: PaginationDto, sortDto: SortDto, searchTerm: string) {
        const { limit, skip, page } = paginationSolver(+paginationDto.page, +paginationDto.limit)
        searchTerm = searchTerm ? searchTerm.toLocaleLowerCase() : '';
        const [tasks, count] = await this.taskRepository.createQueryBuilder(EntityName.Task)
            .leftJoin('task.user', 'user')
            .addSelect(['user.id', 'user.username', 'user.role'])
            .where([
                { name: Like(`%${searchTerm}%`) },
            ])
            .skip(skip)
            .take(limit)
            .getManyAndCount()
        return {
            pagination: paginationGenerator(count, page, limit),
            tasks,
        }
    }
    async findTaskById(id: number) {
        const task = await this.taskRepository.findOneBy({ id })
        if (!task) throw new NotFoundException(TaskMessage.NotFound)
        return task;
    }
    async update(id: number, updateTaskDto: UpdateTaskDto, file: MulterFile) {
        let { name, priority } = updateTaskDto;
        let image: string;
        const task = await this.findTaskById(id)
        if (!file) image = task.image;
        if (!name) name = task.name;
        if (!priority) priority = task.priority;
        Object.assign(task, {
            name,
            priority,
            image,
        });
        return await this.taskRepository.save(task)
    }
    async remove(id: number) {
        const task = await this.findTaskById(id);
        if (task.image) removeFileInPublic(task.image);
        return await this.taskRepository.remove(task);
    }
}
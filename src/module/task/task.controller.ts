import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, UseInterceptors } from "@nestjs/common";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create.dto";
import { SwaggerConsumes } from "src/common/enum/swagger.enum";
import { UploadFile } from "src/common/interceptors/upload-file.interceptor";
import { FileFields } from "src/common/enum/fields.enum";
import { CheckOptionalUploadedFile, CheckRequiredUploadedFile } from "src/common/decorators/upload-file.decorator";
import { MulterFile } from "src/common/types/public.type";
import { MIME_TYPE } from "src/common/enum/mime-type.enum";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { Sortable } from "src/common/decorators/sort.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";
import { UpdateTaskDto } from "./dto/update.dto";
import { TaskMessage } from "./enums/message.enum";

@Controller('task')
@ApiTags('Task')
@AuthDecorator()
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
    ) { }
    @Post()
    @UseInterceptors(UploadFile(FileFields.Image))
    @ApiConsumes(SwaggerConsumes.MULTIPART)
    async create(@Body() createTaskDto: CreateTaskDto, @CheckRequiredUploadedFile(MIME_TYPE.IMAGE) file: MulterFile) {
        await this.taskService.create(createTaskDto, file);
        return {
            statusCode: HttpStatus.CREATED,
            message: TaskMessage.Created,
        }
    }
    @Get('/list')
    @ApiQuery({ name: "search", type: "string", required: false, allowEmptyValue: true, })
    @Pagination()
    @Sortable()
    async findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto, @Query('search') searchTerm?: string) {
        return await this.taskService.findAll(paginationDto, sortDto, searchTerm);
    }
    @Put('/:id')
    @UseInterceptors(UploadFile(FileFields.Image))
    @ApiConsumes(SwaggerConsumes.MULTIPART)
    async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto, @CheckOptionalUploadedFile(MIME_TYPE.IMAGE) file: MulterFile) {
        await this.taskService.update(id, updateTaskDto, file);
        return {
            statusCode: HttpStatus.OK,
            message: TaskMessage.Updated,
        }
    }
    @Delete('/:id')
    async remove(@Param('id') id: number) {
        await this.taskService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: TaskMessage.Deleted,
        }
    }
}
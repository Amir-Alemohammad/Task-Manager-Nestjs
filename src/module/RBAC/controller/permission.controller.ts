import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { PermissionService } from "../service/permission.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { ROLES } from "src/common/enum/roles.enum";
import { CreatePermissionDto, UpdatePermissionDto } from "../dto/permission.dto";
import { SwaggerConsumes } from "src/common/enum/swagger.enum";
import { PermissionMessage } from "../enum/message.enum";
import { Sortable } from "src/common/decorators/sort.decorator";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";

@Controller('permission')
@ApiTags('RBAC')
@AuthDecorator()
@Roles(ROLES.ADMIN)
export class PermissionController {
    constructor(
        private readonly permissionService: PermissionService,
    ) { }
    @Post()
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async create(@Body() createPermissionDto: CreatePermissionDto) {
        await this.permissionService.create(createPermissionDto)
        return {
            statusCode: HttpStatus.CREATED,
            message: PermissionMessage.Created,
        }
    }
    @Put('/:id')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async update(@Param('id') id: number, @Body() updatePermissionDto: UpdatePermissionDto) {
        await this.permissionService.update(id, updatePermissionDto)
        return {
            statusCode: HttpStatus.OK,
            message: PermissionMessage.Updated
        }
    }
    @Get('/list')
    @ApiQuery({ name: "search", type: "string", required: false, allowEmptyValue: true, })
    @Pagination()
    @Sortable()
    async findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto, @Query('search') searchTerm?: string) {
        return await this.permissionService.findAll(paginationDto, sortDto, searchTerm);
    }
    @Delete('/:id')
    @ApiParam({ name: 'id', type: 'integer' })
    async remove(@Param('id') id: number) {
        await this.permissionService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: PermissionMessage.Deleted
        }
    }
}
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from "@nestjs/common";
import { RolesService } from "../service/roles.service";
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { ROLES } from "src/common/enum/roles.enum";
import { CreateRolesDto, UpdateRoleDto } from "../dto/roles.dto";
import { SwaggerConsumes } from "src/common/enum/swagger.enum";
import { RolesMessage } from "../enum/message.enum";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { Sortable } from "src/common/decorators/sort.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";

@Controller('roles')
@ApiTags('RBAC')
@AuthDecorator()
@Roles(ROLES.ADMIN)
export class RolesController {
    constructor(
        private readonly rolesService: RolesService,
    ) { }
    @Post('/:permissionId')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    @ApiParam({ name: "permissionId", type: 'integer' })
    async create(@Body() createRoleDto: CreateRolesDto, @Param('permissionId') permissionId: number) {
        await this.rolesService.create(createRoleDto, permissionId);
        return {
            statusCode: HttpStatus.OK,
            message: RolesMessage.Created,
        }
    }
    @Get('/list')
    @ApiQuery({ name: "search", type: "string", required: false, allowEmptyValue: true, })
    @Pagination()
    @Sortable()
    async findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto, @Query('search') searchTerm?: string) {
        return await this.rolesService.findAll(paginationDto, sortDto, searchTerm);
    }
    @Put('/:id')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        await this.rolesService.update(id, updateRoleDto)
        return {
            statusCode: HttpStatus.OK,
            message: RolesMessage.Updated
        }
    }
    @Delete('/:id')
    @ApiParam({ name: 'id', type: 'integer' })
    async remove(@Param('id') id: number) {
        await this.rolesService.remove(id);
        return {
            statusCode: HttpStatus.OK,
            message: RolesMessage.Deleted
        }
    }
}
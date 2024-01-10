import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { AuthDecorator } from "src/common/decorators/auth.decorator";
import { Roles } from "src/common/decorators/role.decorator";
import { ROLES } from "src/common/enum/roles.enum";
import { RegisterDto } from "../auth/dto/register.dto";
import { UserMessage } from "./enum/message.enum";
import { SwaggerConsumes } from "src/common/enum/swagger.enum";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { Sortable } from "src/common/decorators/sort.decorator";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { SortDto } from "src/common/dtos/sortable.dto";
import { Request } from "express";

@Controller('user')
@ApiTags("User")
@AuthDecorator()
@Roles(ROLES.ADMIN)
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }
    @Post('/create-new-user')
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async create(@Body() createUserDto: RegisterDto) {
        await this.userService.create(createUserDto);
        return {
            statusCode: HttpStatus.CREATED,
            message: UserMessage.Created,
        }
    }
    @Get('/list')
    @ApiQuery({ name: "search", type: "string", required: false, allowEmptyValue: true, })
    @Sortable()
    @Pagination()
    async findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto, @Query('search') searchTerm?: string) {
        return await this.userService.findAll(paginationDto, sortDto, searchTerm)
    }
    @Put('/:id')
    @ApiParam({ name: 'id' })
    @ApiConsumes(SwaggerConsumes.URLENCODED, SwaggerConsumes.JSON)
    async update(@Param('id') id: number, @Body() updateUserDto: RegisterDto) {
        await this.userService.update(id, updateUserDto)
        return {
            statusCode: HttpStatus.OK,
            message: UserMessage.Updated,
        }
    }
    @Delete('/:id')
    async remove(@Param('id') id: number, @Req() request: Request) {
        await this.userService.remove(id, request);
        return {
            statusCode: HttpStatus.OK,
            message: UserMessage.Deleted,
        }
    }
}
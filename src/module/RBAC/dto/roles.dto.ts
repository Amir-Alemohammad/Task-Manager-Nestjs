import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateRolesDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
}
export class UpdateRoleDto {
    @ApiPropertyOptional()
    name: string;
    @ApiPropertyOptional()
    description: string;
    @ApiPropertyOptional()
    permissionId: number;
}
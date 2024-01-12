import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty()
    @IsNotEmpty()
    description: string;
    @ApiProperty()
    @IsNotEmpty()
    slug: string;
}
export class UpdatePermissionDto {
    @ApiPropertyOptional()
    name: string;
    @ApiPropertyOptional()
    description: string;
    @ApiPropertyOptional()
    slug: string;
}
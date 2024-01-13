import { ApiProperty } from "@nestjs/swagger";

export class SetUserRoleDto {
    @ApiProperty({ type: "integer" })
    userId: number;
    @ApiProperty({ type: "string" })
    role: string;
}
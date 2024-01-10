import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: "09391036098" })
    @IsNotEmpty()
    username: string;
    @ApiProperty()
    @IsNotEmpty()
    password: string;
}
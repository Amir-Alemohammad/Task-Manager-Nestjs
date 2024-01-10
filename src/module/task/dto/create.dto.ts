import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Priority } from "../enums/priority.enum";

export class CreateTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    @ApiProperty({ type: 'enum', enum: Priority })
    @IsNotEmpty()
    priority: Priority
    @ApiProperty({ type: String, name: "image", format: "binary" })
    image: string;

}
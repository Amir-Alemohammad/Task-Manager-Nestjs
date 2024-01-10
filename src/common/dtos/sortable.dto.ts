import { ApiPropertyOptional } from "@nestjs/swagger";
import { SortType } from "../enum/sort.enum";

export class SortDto {
    @ApiPropertyOptional()
    sortBy: string;
    @ApiPropertyOptional({ type: "string", enum: SortType })
    sortType: SortType;
}
import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { SortType } from "../enum/sort.enum";

export function Sortable() {
    return applyDecorators(
        ApiQuery({ name: "sortBy", type: "string", required: false, allowEmptyValue: true }),
        ApiQuery({ name: "sortType", type: "string", enum: SortType, required: false, allowEmptyValue: true })
    )
}
import { applyDecorators } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";

export function Pagination() {
    return applyDecorators(
        ApiQuery({ name: "page", type: "integer", example: 0, required: false }),
        ApiQuery({ name: "limit", type: "integer", example: 10, required: false })
    )
}
import { SortDto } from "../dtos/sortable.dto";
import { SortType } from "../enum/sort.enum";

export async function orderGenerator(repository: any, sortDto: SortDto) {
    const row = (await repository.findOne({ where: {} })) ?? {};
    const properties = Object.keys(row)
    let order: { [x: string]: SortType; } = { id: SortType.DESC }
    if (properties.includes(sortDto.sortBy)) {
        let type: "ASC" | "DESC" = "DESC"
        if (sortDto.sortType in SortType) type = sortDto.sortType
        order = { [sortDto.sortBy]: sortDto.sortType }
    }
    return order;
}
import { TypeOrmDataSourceConfig } from "../../config/typeorm.config";
import { DataSource } from "typeorm"
let dataSource = new DataSource(TypeOrmDataSourceConfig);
export async function getDbConnection() {
    let connection = await dataSource.initialize();
    return connection;
}
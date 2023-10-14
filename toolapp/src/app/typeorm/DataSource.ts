import { DataSource } from 'typeorm';
import { Job as EJob, Task as ETask } from './entity/JobTask';

function createDataSourceSqlite(): DataSource {
  const dataSource = new DataSource({
    type: 'sqlite',
    // database: ':memory:',
    database: 'db.sqlite3',
    entities: [EJob, ETask],
    synchronize: true,
    logging: false,
  });
  return dataSource;
}

// function createDataSourcePostgres(config: any): DataSource {
//   const dataSource = new DataSource({
//     type: 'postgres',
//     host: config.postgres?.host || 'localhost',
//     port: 5432,
//     username: config.postgres?.username || 'postgres',
//     password: config.postgres?.password || 'postgres',
//     database: config.postgres?.database || 'mai-hc-toolapp',

//     entities: [EJob, ETask],
//     synchronize: true, // test only
//     // dropSchema: true, // test only
//     logging: false,
//   });
//   return dataSource;
// }

export function createDataSource(config: any): DataSource {
  return createDataSourceSqlite();
  // if (config.type === 'sqlite') {
  //   return createDatasourceSqliteInMemory();
  // }else if (config.type === 'postgres') {
  //   return createDatasourcePostgres(config);
  // }
  // throw new Error('Unknown db type');
}

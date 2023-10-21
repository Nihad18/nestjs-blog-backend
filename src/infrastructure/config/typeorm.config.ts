/* eslint-disable prettier/prettier */
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import entities from 'src/domein/entities';

export default () =>
  ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    entities,
    synchronize: true,
    ssl: {
      rejectUnauthorized: false,
    },
  } as PostgresConnectionOptions);

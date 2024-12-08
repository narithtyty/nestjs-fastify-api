import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: dbUrl,
  entities: [User],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: true,
  },
  extra: {
    max: 20,
  },
});

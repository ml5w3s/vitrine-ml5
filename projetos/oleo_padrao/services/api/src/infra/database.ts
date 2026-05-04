import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'user_oleo',
  password: process.env.DB_PASSWORD || 'password_oleo',
  database: process.env.DB_NAME || 'oleo_db',
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  connect: () => pool.connect(),
};

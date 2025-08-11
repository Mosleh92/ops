const isProd = process.env.NODE_ENV === 'production' || !!process.env.RENDER;
const url = process.env.DATABASE_URL;

module.exports = url ? {
  type: 'postgres',
  url,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  entities: ['dist/**/*.entity.{js,ts}', 'dist/**/entities/*.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  synchronize: false,
  logging: false
} : {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ops',
  ssl: false,
  entities: ['dist/**/*.entity.{js,ts}', 'dist/**/entities/*.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  synchronize: false,
  logging: false
};

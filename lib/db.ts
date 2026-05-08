import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';

function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  try {
    new URL(url);
    return url;
  } catch {
    throw new Error('DATABASE_URL must be a valid Neon Postgres connection string');
  }
}

export const sql = neon(process.env.DATABASE_URL?.startsWith('postgres')
  ? process.env.DATABASE_URL
  : 'postgresql://placeholder:placeholder@localhost/placeholder'
);

export const db = drizzle(sql, { schema });

export function assertDatabaseConfigured() {
  getDatabaseUrl();
}

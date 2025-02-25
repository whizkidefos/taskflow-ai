import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.NEXT_PUBLIC_DB_URL || 'file:local.db',
});

export interface CreateStackInput {
  title: string;
  userId: string;
}

export async function createStack({ title, userId }: CreateStackInput) {
  const result = await db.execute({
    sql: `INSERT INTO todo_stacks (id, title, user_id) VALUES (?, ?, ?)`,
    args: [crypto.randomUUID(), title, userId]
  });
  return result;
}

export async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS todo_stacks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      archived INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS todo_items (
      id TEXT PRIMARY KEY,
      stack_id TEXT NOT NULL,
      text TEXT NOT NULL,
      completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (stack_id) REFERENCES todo_stacks(id) ON DELETE CASCADE
    );
  `);
}

// Initialize the database when the module is imported
initializeDatabase().catch(console.error);
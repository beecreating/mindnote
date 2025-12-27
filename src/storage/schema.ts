export const SCHEMA_VERSION = 1;

export const MIGRATIONS: string[] = [
  `
  PRAGMA journal_mode = WAL;

  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS day_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    iso_date TEXT NOT NULL UNIQUE,   -- "YYYY-MM-DD"
    note TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  INSERT OR IGNORE INTO meta(key, value) VALUES ('schema_version', '${SCHEMA_VERSION}');
  `,
];
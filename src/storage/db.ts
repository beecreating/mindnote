import * as SQLite from "expo-sqlite";
import { MIGRATIONS, SCHEMA_VERSION } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

async function getDb() {
  if (!db) {
    // New filename = fresh DB if you ever need to “nuke”
    db = await SQLite.openDatabaseAsync("mindnote_list_v1.db");
  }
  return db;
}

async function ensureMeta(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

async function getSchemaVersion(database: SQLite.SQLiteDatabase) {
  const rows = await database.getAllAsync<{ value: string }>(
    "SELECT value FROM meta WHERE key = ?",
    "schema_version"
  );
  if (!rows.length) return 0;
  const n = Number(rows[0].value);
  return Number.isFinite(n) ? n : 0;
}

export async function migrate() {
  const database = await getDb();
  await ensureMeta(database);

  const current = await getSchemaVersion(database);
  if (current >= SCHEMA_VERSION) return;

  for (const sql of MIGRATIONS) {
    await database.execAsync(sql);
  }

  await database.runAsync(
    "INSERT OR REPLACE INTO meta(key, value) VALUES(?, ?)",
    "schema_version",
    String(SCHEMA_VERSION)
  );
}

export type DayNote = { iso_date: string; note: string };

export async function getMonthNotes(year: number, month: number): Promise<Record<string, string>> {
  const database = await getDb();
  const mm = String(month).padStart(2, "0");
  const prefix = `${year}-${mm}-`;

  const rows = await database.getAllAsync<DayNote>(
    "SELECT iso_date, note FROM day_notes WHERE iso_date LIKE ?",
    `${prefix}%`
  );

  const map: Record<string, string> = {};
  for (const r of rows) map[r.iso_date] = r.note;
  return map;
}

export async function upsertDayNote(isoDate: string, note: string) {
  const database = await getDb();
  await database.runAsync(
    `INSERT INTO day_notes(iso_date, note)
     VALUES(?, ?)
     ON CONFLICT(iso_date) DO UPDATE SET
       note = excluded.note,
       updated_at = datetime('now')`,
    isoDate,
    note
  );
}

export async function deleteDayNote(isoDate: string) {
  const database = await getDb();
  await database.runAsync("DELETE FROM day_notes WHERE iso_date = ?", isoDate);
}

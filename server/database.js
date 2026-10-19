import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const dataDirectory = new URL("./data/", import.meta.url);

mkdirSync(dataDirectory, { recursive: true });

const database = new DatabaseSync(new URL("workout.sqlite", dataDirectory));

database.exec(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK (length(trim(name)) > 0)
  )
`);

export default database;

import { DatabaseSync } from "node:sqlite";
import turso from "./turso.js";

const localDatabase = new DatabaseSync(
  new URL("./data/workout.sqlite", import.meta.url),
  { readOnly: true },
);

let transaction;

try {
  const exercises = localDatabase
    .prepare("SELECT id, name FROM exercises ORDER BY id")
    .all();

  transaction = await turso.transaction("write");

  const existing = await transaction.execute(
    "SELECT COUNT(*) AS total FROM exercises",
  );

  if (Number(existing.rows[0].total) !== 0) {
    throw new Error("Turso already contains exercises. Migration stopped.");
  }

  for (const exercise of exercises) {
    await transaction.execute({
      sql: "INSERT INTO exercises (id, name) VALUES (?, ?)",
      args: [exercise.id, exercise.name],
    });
  }

  const copied = await transaction.execute(
    "SELECT id, name FROM exercises ORDER BY id",
  );

  const matches =
    copied.rows.length === exercises.length &&
    copied.rows.every(
      (exercise, index) =>
        Number(exercise.id) === exercises[index].id &&
        exercise.name === exercises[index].name,
    );

  if (!matches) {
    throw new Error("Copied exercises do not match the local database.");
  }

  await transaction.commit();

  console.log(`Migrated ${exercises.length} exercises to Turso.`);
} catch (error) {
  if (transaction && !transaction.closed) {
    await transaction.rollback();
  }

  throw error;
} finally {
  transaction?.close();
  localDatabase.close();
  turso.close();
}

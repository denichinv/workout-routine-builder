import database from "./database.js";
import defaultExercises from "../src/data/exercises.js";

const insertExercise = database.prepare(`
  INSERT INTO exercises (id, name)
  VALUES (?, ?)
`);

try {
  database.exec("BEGIN");

  for (const exercise of defaultExercises) {
    insertExercise.run(exercise.id, exercise.name);
  }

  database.exec("COMMIT");
  console.log("Added the default exercises.");
} catch (error) {
  database.exec("ROLLBACK");
  throw error;
} finally {
  database.close();
}

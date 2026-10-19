import express from "express";
import database from "./database.js";

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/exercises", (req, res) => {
  const exercises = database
    .prepare("SELECT id, name FROM exercises ORDER BY id")
    .all();

  res.json(exercises);
});

app.post("/api/exercises", (req, res) => {
  const name = req.body?.name;

  if (typeof name !== "string") {
    return res.status(400).json({
      message: "Exercise name must be text.",
    });
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0 || trimmedName.length > 100) {
    return res.status(400).json({
      message: "Exercise name must contain between 1 and 100 characters.",
    });
  }

  const result = database
    .prepare("INSERT INTO exercises (name) VALUES (?)")
    .run(trimmedName);

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    name: trimmedName,
  });
});
app.post("/api/exercises/import", (req, res) => {
  const exercises = req.body?.exercises;

  const isValid =
    Array.isArray(exercises) &&
    exercises.every(
      (exercise) =>
        typeof exercise?.name === "string" &&
        exercise.name.trim().length > 0 &&
        exercise.name.trim().length <= 100,
    );

  if (!isValid) {
    return res.status(400).json({
      message: "Every exercise must have a name of 1 to 100 characters.",
    });
  }

  try {
    database.exec("BEGIN");

    const existingExercises = database
      .prepare("SELECT id, name FROM exercises ORDER BY id")
      .all();

    const existingNames = new Set(
      existingExercises.map((exercise) => exercise.name.trim().toLowerCase()),
    );

    const insert = database.prepare("INSERT INTO exercises (name) VALUES (?)");

    for (const exercise of exercises) {
      const name = exercise.name.trim();
      const normalizedName = name.toLowerCase();

      if (!existingNames.has(normalizedName)) {
        insert.run(name);
        existingNames.add(normalizedName);
      }
    }

    const updatedExercises = database
      .prepare("SELECT id, name FROM exercises ORDER BY id")
      .all();

    database.exec("COMMIT");
    res.json(updatedExercises);
  } catch {
    if (database.isTransaction) {
      database.exec("ROLLBACK");
    }

    res.status(500).json({
      message: "Could not import exercises. Please try again.",
    });
  }
});
app.delete("/api/exercises/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Exercise ID must be a positive integer.",
    });
  }

  const result = database.prepare("DELETE FROM exercises WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      message: "Exercise not found.",
    });
  }

  res.status(204).end();
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(3001, "127.0.0.1", () => {
  console.log("Workout API is running on http://127.0.0.1:3001");
});

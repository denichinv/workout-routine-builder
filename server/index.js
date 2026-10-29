import express from "express";
import process from "node:process";
import database from "./turso.js";

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/exercises", async (req, res) => {
  const result = await database.execute(
    "SELECT id, name FROM exercises ORDER BY id",
  );

  res.json(result.rows);
});

app.post("/api/exercises", async (req, res) => {
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

  const result = await database.execute({
    sql: "INSERT INTO exercises (name) VALUES (?)",
    args: [trimmedName],
  });

  res.status(201).json({
    id: Number(result.lastInsertRowid),
    name: trimmedName,
  });
});

app.post("/api/exercises/import", async (req, res) => {
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

  let transaction;

  try {
    transaction = await database.transaction("write");

    const existing = await transaction.execute("SELECT name FROM exercises");

    const existingNames = new Set(
      existing.rows.map((exercise) => exercise.name.trim().toLowerCase()),
    );

    for (const exercise of exercises) {
      const name = exercise.name.trim();
      const normalizedName = name.toLowerCase();

      if (!existingNames.has(normalizedName)) {
        await transaction.execute({
          sql: "INSERT INTO exercises (name) VALUES (?)",
          args: [name],
        });

        existingNames.add(normalizedName);
      }
    }

    const result = await transaction.execute(
      "SELECT id, name FROM exercises ORDER BY id",
    );

    await transaction.commit();

    res.json(result.rows);
  } catch {
    if (transaction && !transaction.closed) {
      await transaction.rollback();
    }

    res.status(500).json({
      message: "Could not import exercises. Please try again.",
    });
  } finally {
    transaction?.close();
  }
});
app.delete("/api/exercises/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Exercise ID must be a positive integer.",
    });
  }

  const result = await database.execute({
    sql: "DELETE FROM exercises WHERE id = ?",
    args: [id],
  });

  if (result.rowsAffected === 0) {
    return res.status(404).json({
      message: "Exercise not found.",
    });
  }

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  const status = error.status === 400 || error.status === 413 ? error.status : 500;
  const message =
    status === 400
      ? "Invalid JSON request."
      : status === 413
        ? "Request body is too large."
        : "Could not complete the request. Please try again.";

  res.status(status).json({ message });
});

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || "127.0.0.1";

app.listen(port, host, () => {
  console.log(`Workout API is running on http://${host}:${port}`);
});

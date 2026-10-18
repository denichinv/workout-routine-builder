import express from "express";
import defaultExercises from "../src/data/exercises.js";

const app = express();

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.get("/api/exercises", (req, res) => {
  res.json(defaultExercises);
});
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(3001, "127.0.0.1", () => {
  console.log("Workout API is running on http://127.0.0.1:3001");
});

export async function fetchExercises(signal) {
  const response = await fetch("/api/exercises", { signal });

  if (!response.ok) {
    throw new Error("Could not load exercises. Please try again.");
  }

  const exercises = await response.json();

  if (
    !Array.isArray(exercises) ||
    !exercises.every(
      (exercise) =>
        exercise !== null &&
        Number.isInteger(exercise.id) &&
        typeof exercise.name === "string" &&
        exercise.name.trim().length > 0,
    )
  ) {
    throw new Error("The server returned invalid exercise data.");
  }

  return exercises;
}

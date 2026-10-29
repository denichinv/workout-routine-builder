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

export async function createExercise(name) {
  const response = await fetch("/api/exercises", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Could not add exercise. Please try again.",
    );
  }

  return response.json();
}

export async function importExercises(exercises, signal) {
  const response = await fetch("/api/exercises/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ exercises }),
    signal,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Could not import exercises. Please try again.",
    );
  }

  return response.json();
}

export async function deleteExercise(id) {
  const response = await fetch(`/api/exercises/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Could not delete exercise. Please try again.",
    );
  }
}

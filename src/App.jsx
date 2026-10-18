import { useEffect, useState } from "react";
import Planner from "./components/Planner";
import ExerciseList from "./components/ExerciseList";
import defaultExercises from "./data/exercises";
import { fetchExercises } from "./api/exercises.js";

function App() {
  // define state and load local storage
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem("custom-exercises");
    return saved ? JSON.parse(saved) : defaultExercises;
  });
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);
  const [exercisesError, setExercisesError] = useState("");
  const [hasSavedExercises] = useState(
    () => localStorage.getItem("custom-exercises") !== null,
  );
  const [exerciseRequest, setExerciseRequest] = useState(0);

  const [routine, setRoutine] = useState(() => {
    const saved = localStorage.getItem("weekly-plan");
    return saved
      ? JSON.parse(saved)
      : {
          Monday: [],
          Tuesday: [],
          Wednesday: [],
          Thursday: [],
          Friday: [],
          Saturday: [],
          Sunday: [],
        };
  });

  // functions
  const handleRoutineChange = (day, index, field, value) => {
    setRoutine((prev) => {
      const updatedDay = [...prev[day]];
      updatedDay[index] = {
        ...updatedDay[index],
        [field]: Number(value),
      };
      return {
        ...prev,
        [day]: updatedDay,
      };
    });
  };

  const handleAddExercise = (day, exercise) => {
    const newExercise = {
      ...exercise,
      sets: 3,
      reps: 10,
    };

    setRoutine((prev) => ({
      ...prev,
      [day]: [...prev[day], newExercise],
    }));
  };

  const handleRemove = (day, index) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  const onDeleteExercise = (id) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  };

  const onAddCustomExercise = (exercise) => {
    let nextId = exercises.length + 1;
    const newExercise = { id: nextId, name: exercise };
    setExercises((prev) => [...prev, newExercise]);
  };
  useEffect(() => {
    const controller = new AbortController();
    setIsLoadingExercises(true);
    setExercisesError("");
    async function loadExercises() {
      try {
        const exercises = await fetchExercises(controller.signal);

        if (!controller.signal.aborted && !hasSavedExercises) {
          setExercises(exercises);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setExercisesError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingExercises(false);
        }
      }
    }

    loadExercises();

    return () => controller.abort();
  }, [hasSavedExercises, exerciseRequest]);
  // save to local storage
  useEffect(() => {
    localStorage.setItem("weekly-plan", JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    if (!isLoadingExercises && !exercisesError) {
      localStorage.setItem("custom-exercises", JSON.stringify(exercises));
    }
  }, [exercises, isLoadingExercises, exercisesError]);

  const trainingDays = Object.values(routine).filter(
    (day) => day.length > 0,
  ).length;

  return (
    <div className="app-shell">
      <a className="skip-link" href="#weekly-plan">
        Skip to weekly plan
      </a>
      <header className="app-header">
        <div className="wordmark" aria-label="Workout Routine Builder">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          WORKOUT<span className="wordmark-light"> / ROUTINE BUILDER</span>
        </div>
        <span className="storage-note">Stored on this device</span>
      </header>
      <main>
        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <p className="eyebrow">YOUR TRAINING, PLANNED.</p>
            <h1 id="page-title">Workout Routine Builder</h1>
            <p className="intro-copy">
              Build a week you can stick to. Choose your movements, set your
              reps, make it yours.
            </p>
          </div>
          <div className="week-summary">
            <strong>
              {trainingDays}
              <span> / 7</span>
            </strong>
            <span>days planned</span>
          </div>
        </section>
        <div className="workspace">
          {isLoadingExercises ? (
            <section className="panel" aria-label="Exercise Library">
              <div className="panel-heading">
                <p role="status">Loading exercises…</p>
              </div>
            </section>
          ) : exercisesError ? (
            <section className="panel" aria-label="Exercise Library">
              <div className="custom-exercise">
                <p role="alert">{exercisesError}</p>
                <button
                  className="primary-button"
                  onClick={() => setExerciseRequest((request) => request + 1)}
                >
                  Retry
                </button>
              </div>
            </section>
          ) : (
            <ExerciseList
              exercises={exercises}
              onAddExercise={handleAddExercise}
              onAddCustomExercise={onAddCustomExercise}
              onDeleteExercise={onDeleteExercise}
            />
          )}
          <Planner
            routine={routine}
            handleRemove={handleRemove}
            onChange={handleRoutineChange}
          />
        </div>
      </main>
      <footer className="app-footer">
        <span>Plan. Train. Repeat.</span>
        <span>Your workout data is saved automatically in your browser.</span>
      </footer>
    </div>
  );
}

export default App;

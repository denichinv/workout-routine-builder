import { useEffect, useState } from "react";
import Planner from "./components/Planner";
import ExerciseList from "./components/ExerciseList";
import defaultExercises from "./data/exercises";

function App() {
  // define state and load local storage
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem("custom-exercises");
    return saved ? JSON.parse(saved) : defaultExercises;
  });

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

  // save to local storage
  useEffect(() => {
    localStorage.setItem("weekly-plan", JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem("custom-exercises", JSON.stringify(exercises));
  }, [exercises]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <div className="container mx-auto p-4 md:p-6">
        <header className="text-center py-6 mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            <span className="inline-block mr-2 transform -rotate-12">🏋️</span>
            Workout Routine Builder
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Create your custom weekly workout plan by adding exercises to
            specific days
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-1">
            <ExerciseList
              exercises={exercises}
              onAddExercise={handleAddExercise}
              onAddCustomExercise={onAddCustomExercise}
              onDeleteExercise={onDeleteExercise}
            />
          </div>
          <div className="lg:col-span-1">
            <Planner
              routine={routine}
              handleRemove={handleRemove}
              onChange={handleRoutineChange}
            />
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm mt-12 pb-6">
          Your workout data is saved automatically in your browser
        </footer>
      </div>
    </div>
  );
}

export default App;

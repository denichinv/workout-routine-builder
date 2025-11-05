export default function Planner({ routine, handleRemove, onChange }) {
  const totalExerciseCount = Object.values(routine).reduce(
    (count, exercises) => count + exercises.length,
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <h2 className="text-xl font-semibold">Weekly Plan</h2>
        <div className="text-sm">
          <span className="bg-white text-indigo-600 px-2 py-1 rounded-full">
            {totalExerciseCount}{" "}
            {totalExerciseCount === 1 ? "exercise" : "exercises"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-7 gap-4">
          {Object.entries(routine).map(([day, exercises]) => (
            <div
              key={day}
              className={`border rounded-lg overflow-hidden ${
                exercises.length ? "border-indigo-200" : "border-gray-200"
              }`}
            >
              <div
                className={`p-2 text-center ${
                  exercises.length ? "bg-indigo-100" : "bg-gray-50"
                }`}
              >
                <h3 className="font-bold">{day}</h3>
              </div>

              <div className="p-3">
                {exercises.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm">Add exercises</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((ex, index) => (
                      <div
                        key={index}
                        className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:shadow transition-shadow group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="font-medium text-indigo-700">
                            {ex.name}
                          </p>
                          <button
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                            onClick={() => handleRemove(day, index)}
                            aria-label="Remove exercise"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        <div className="flex gap-2 items-center">
                          <div className="flex-1">
                            <label
                              htmlFor={`sets-${day}-${index}`}
                              className="block text-xs text-gray-500 mb-1"
                            >
                              Sets
                            </label>
                            <input
                              id={`sets-${day}-${index}`}
                              type="number"
                              min="1"
                              value={ex.sets}
                              onChange={(e) =>
                                onChange(day, index, "sets", e.target.value)
                              }
                              className="w-full px-2 py-1 border rounded text-sm focus:ring focus:ring-indigo-200"
                            />
                          </div>
                          <div className="flex-1">
                            <label
                              htmlFor={`reps-${day}-${index}`}
                              className="block text-xs text-gray-500 mb-1"
                            >
                              Reps
                            </label>
                            <input
                              id={`reps-${day}-${index}`}
                              type="number"
                              min="1"
                              value={ex.reps}
                              onChange={(e) =>
                                onChange(day, index, "reps", e.target.value)
                              }
                              className="w-full px-2 py-1 border rounded text-sm focus:ring focus:ring-indigo-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

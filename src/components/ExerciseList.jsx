import { useState } from "react";

export default function ExerciseList({
  exercises,
  onAddExercise,
  onAddCustomExercise,
  onDeleteExercise,
}) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [customExercise, setCustomExercise] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Group exercises by first letter for better organization
  const categories = [
    "All",
    ...new Set(exercises.map((ex) => ex.name.charAt(0).toUpperCase())),
  ].sort();

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      ex.name.charAt(0).toUpperCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    if (customExercise.trim()) {
      onAddCustomExercise(customExercise);
      setCustomExercise("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white">
        <h2 className="text-xl font-semibold">Exercise Library</h2>
      </div>

      <div className="p-4">
        {/* Search and filter */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="max-h-64 overflow-y-auto mb-4 pr-2">
          {filteredExercises.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No exercises found</p>
          ) : (
            filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="flex justify-between items-center mb-2 p-2 hover:bg-gray-50 rounded group"
              >
                <div className="flex items-center">
                  <span className="text-indigo-500 mr-2">•</span>
                  <p className="font-medium">{ex.name}</p>
                  <button
                    className="ml-2 text-red-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onDeleteExercise(ex.id)}
                    aria-label="Delete exercise"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <select
                  className="border p-1 rounded text-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  onChange={(e) => {
                    const day = e.target.value;
                    if (day) onAddExercise(day, ex);
                    e.target.value = "";
                  }}
                >
                  <option value="">Add to day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add new exercise */}
      <div className="bg-gray-50 p-4 border-t">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">
            Add New Exercise
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              type="text"
              placeholder="Exercise name"
              value={customExercise}
              onChange={(e) => setCustomExercise(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

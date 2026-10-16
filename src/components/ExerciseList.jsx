import { useRef, useState } from "react";

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
  const searchRef = useRef(null);
  const categories = [
    "All",
    ...[
      ...new Set(exercises.map((ex) => ex.name.charAt(0).toUpperCase())),
    ].sort(),
  ];
  // A removed letter should never leave the library stuck on an invisible filter.
  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "All";
  const filteredExercises = exercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeCategory === "All" ||
        ex.name.charAt(0).toUpperCase() === activeCategory),
  );
  const handleAdd = (event) => {
    event.preventDefault();
    if (customExercise.trim()) {
      onAddCustomExercise(customExercise.trim());
      setCustomExercise("");
    }
  };

  return (
    <aside className="library panel" aria-labelledby="library-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">CHOOSE YOUR MOVEMENTS</p>
          <h2 id="library-title">Exercise Library</h2>
        </div>
        <span className="count-label">{exercises.length}</span>
      </div>
      <div className="library-tools">
        <label className="sr-only" htmlFor="exercise-search">
          Search exercises
        </label>
        <div className="search-field">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            ref={searchRef}
            id="exercise-search"
            type="search"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => {
                setSearchQuery("");
                searchRef.current.focus();
              }}
            >
              ×
            </button>
          )}
        </div>
        <div className="letter-filters" aria-label="Filter by first letter">
          {categories.map((category) => (
            <button
              key={category}
              aria-pressed={activeCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="exercise-library-list">
        {filteredExercises.length === 0 ? (
          <div className="library-empty">
            <p>No exercises found</p>
            <span>Try another search or add your own below.</span>
          </div>
        ) : (
          filteredExercises.map((ex) => (
            <div key={ex.id} className="library-exercise">
              <div className="library-exercise-name">
                <p>{ex.name}</p>
                <button
                  className="icon-button delete-button"
                  onClick={() => onDeleteExercise(ex.id)}
                  aria-label="Delete exercise"
                  title={`Delete ${ex.name} from library`}
                >
                  ×
                </button>
              </div>
              <select
                aria-label={`Add ${ex.name} to day`}
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) onAddExercise(e.target.value, ex);
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
      <form className="custom-exercise" noValidate onSubmit={handleAdd}>
        <label htmlFor="custom-exercise">Add New Exercise</label>
        <p>Missing a movement? Add it to your library.</p>
        <div className="custom-exercise-fields">
          <input
            id="custom-exercise"
            placeholder="Exercise name"
            value={customExercise}
            onChange={(e) => setCustomExercise(e.target.value)}
          />
          <button className="primary-button" disabled={!customExercise.trim()}>
            Add
          </button>
        </div>
      </form>
    </aside>
  );
}

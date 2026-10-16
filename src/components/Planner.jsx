export default function Planner({ routine, handleRemove, onChange }) {
  const totalExerciseCount = Object.values(routine).reduce(
    (count, exercises) => count + exercises.length,
    0,
  );
  return (
    <section
      className="planner panel"
      id="weekly-plan"
      tabIndex={-1}
      aria-labelledby="planner-title"
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">THE WEEK AHEAD</p>
          <h2 id="planner-title">Weekly Plan</h2>
        </div>
        <span className="count-label">
          {totalExerciseCount}{" "}
          {totalExerciseCount === 1 ? "exercise" : "exercises"}
        </span>
      </div>
      <div className="week-days">
        {Object.entries(routine).map(([day, exercises]) => (
          <section
            key={day}
            className={`day-row ${exercises.length ? "day-planned" : ""}`}
            aria-label={`${day} workout`}
          >
            <div className="day-heading">
              <h3>{day}</h3>
              <span>
                {exercises.length ? `${exercises.length} planned` : "Unplanned"}
              </span>
            </div>
            <div className="day-content">
              {exercises.length === 0 ? (
                <div className="day-empty">
                  <span aria-hidden="true">＋</span>
                  <p>Add exercises</p>
                  <span className="empty-hint">
                    Choose a movement from the library
                  </span>
                </div>
              ) : (
                exercises.map((ex, index) => (
                  <div key={index} className="planned-exercise">
                    <p className="planned-exercise-name">{ex.name}</p>
                    <div className="exercise-prescription">
                      <div className="number-field">
                        <label htmlFor={`sets-${day}-${index}`}>Sets</label>
                        <input
                          id={`sets-${day}-${index}`}
                          type="number"
                          min="1"
                          value={ex.sets}
                          onChange={(e) =>
                            onChange(day, index, "sets", e.target.value)
                          }
                        />
                      </div>
                      <span className="multiply" aria-hidden="true">
                        ×
                      </span>
                      <div className="number-field">
                        <label htmlFor={`reps-${day}-${index}`}>Reps</label>
                        <input
                          id={`reps-${day}-${index}`}
                          type="number"
                          min="1"
                          value={ex.reps}
                          onChange={(e) =>
                            onChange(day, index, "reps", e.target.value)
                          }
                        />
                      </div>
                      <button
                        className="icon-button delete-button"
                        onClick={() => handleRemove(day, index)}
                        aria-label="Remove exercise"
                        title={`Remove ${ex.name} from ${day}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

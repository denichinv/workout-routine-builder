export default function ExerciseList({exercises, onAddExercise}){
    
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return(
    <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold mb-4 ">
            Available Exercises
        </h2>
        {exercises.map((ex) => (
            <div key={ex.id} className="flex not-only:justify-between items-center mb-2">
                <span>{ex.name}</span>
                <select className="border p-1 rounded" onChange={(e) => {
                    const day = e.target.value;
                    if(day) onAddExercise(day,ex)
                        e.target.value=""
                }}>
                    <option value="">Add to day</option>
                    {days.map((day) => (
                        <option key={day} value={day}> {day}</option>
                    ))}
                </select>
                </div>
        ))}
    </div>
  )
}
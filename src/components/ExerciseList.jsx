import { useState } from "react";

export default function ExerciseList({exercises, onAddExercise, onAddCustomExercise}){
    
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [customExercise, setCustomExercise] = useState("")

  const handleAdd = () => {
    if (customExercise.trim()){
        onAddCustomExercise(customExercise)
        setCustomExercise("")
    }
  }
  return(
    <div className="bg-white rounded-xl p-4 shadow">
        <h2 className="text-xl font-semibold mb-4 ">
            Available Exercises
        </h2>
        {exercises.map((ex) => (
            <div key={ex.id} className="flex not-only:justify-between items-center mb-2">
                <div className="flex justify-between items-center group hover:text-xl">

                <p className="">{ex.name}</p>
                <button    className="text-red-500 text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity mx-1">❌</button>
                </div>
                <select className="border p-1 rounded focus:border-blue-300" onChange={(e) => {
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
    <div className="flex flex-col items-center bg-white p-4 mt-4 rounded-lg shadow ">

    <label className="text-lg font-medium mb-2 ">Add More Exercises</label>

    <div className="flex gap-2">
          <input className="border rounded-lg px-3 py-1 focus:outline-none focus:ring focus:border-blue-300" type="text" value={customExercise} onChange={(e) => setCustomExercise(e.target.value)} />
       <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-all" onClick={handleAdd}>Add</button>
    </div>
      
    </div>
        
    </div>
  )
}
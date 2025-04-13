import { useEffect, useState } from "react"
import Planner from "./components/Planner"
import ExerciseList from "./components/ExerciseList"
import exercises from "./data/exercises"

function App() {



  const [routine,setRoutine] = useState(() => {

    const saved = localStorage.getItem('weekly-plan')

    if(saved){

      return(
        JSON.parse(saved)
      )

    }
else{

return(

     {

    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],

     } 
    )
   


}
    
  })


  const handleAddExercise = (day,exercise) => {
    setRoutine((prev) => ({
      ...prev, 
      [day]: [...prev[day],exercise],
    }))
  }

  const handleRemove = (day,index) => {
    setRoutine((prev) => ({
      ...prev,
      [day]: prev[day].filter((_,i) => i!==index)
    }))

  }
useEffect(() => {
  const stringData = JSON.stringify(routine)
  localStorage.setItem('weekly-plan', stringData)
},[routine])
  return (
    <div className="p-4 font-sans min-h-screen bg-gray-100">
<h1 className="text-3xl font-bold text-center mb-6">🏋️ Workout Routine Builder</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
  <ExerciseList exercises={exercises} onAddExercise={handleAddExercise}/>
<Planner routine={routine} handleRemove={handleRemove}/> 
</div>
    </div>
  )
}

export default App

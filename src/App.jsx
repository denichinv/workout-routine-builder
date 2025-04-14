import { useEffect, useState } from "react"
import Planner from "./components/Planner"
import ExerciseList from "./components/ExerciseList"
import defaultExercises from "./data/exercises"

function App() {


   // define state and load local storage
  const [exercises,setExercises] = useState(() => {

  const saved = localStorage.getItem('custom-exercises')

  return   saved ? JSON.parse(saved) : defaultExercises
    

  })


  const [routine,setRoutine] = useState(() => {

    const saved = localStorage.getItem('weekly-plan')

   return saved ? JSON.parse(saved) : {

    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],

     } 
    
  })

  // functions

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


const onAddCustomExercise = (exercise) => {
  let nextId = exercises.length + 1
  const newExercise = {id:nextId , name:exercise}
setExercises((prev) => [...prev,newExercise])
  
}
  // save to local storage 
useEffect(() => {
  const stringData = JSON.stringify(routine)
  localStorage.setItem('weekly-plan', stringData)
},[routine])


useEffect(() => {
  
  const stringData = JSON.stringify(exercises)
  localStorage.setItem('custom-exercises',stringData)
  
},[exercises])


  return (
    <div className="p-4 font-sans min-h-screen bg-gray-100">
<h1 className="text-3xl font-bold text-center mb-6">🏋️ Workout Routine Builder</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
  <ExerciseList exercises={exercises} onAddExercise={handleAddExercise} onAddCustomExercise={onAddCustomExercise}/>
<Planner routine={routine} handleRemove={handleRemove}/> 
</div>
    </div>
  )
}

export default App

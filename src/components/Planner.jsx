export default function Planner ({routine}){
    return(
        <div className="bg-white rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-4">Weekly Plan</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(routine).map(([day,exercises]) => 
                 ( 
                    <div key={day} className="border p-2 rounded bg-gray-50">
                        <h3 className="font-bold text-center mb-2">{day}</h3>
                        {exercises.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center">No exercises</p>
                        ) : (
                            exercises.map((ex,index) => (
                                <p key={index} className="text-sm mb-1">{ex.name}</p>
                            ))
                        )}
                        </div>
                 ))}
            </div>
        </div>
    )
}
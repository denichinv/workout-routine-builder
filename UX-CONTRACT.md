# Workout planner interaction contract

## Scope

Single-screen local planner. Product behavior comes from the existing App, ExerciseList and Planner implementations and the current redesign request. Visual intent lives in DESIGN.md. No account, API or remote save exists in this phase.

## Canonical UI Map

| Capability     | Canonical owner                   | Source of truth  | Allowed variants             | Verification                   |
| -------------- | --------------------------------- | ---------------- | ---------------------------- | ------------------------------ |
| Select/Listbox | ExerciseList native select        | DESIGN.md        | native OS popup              | browser selection and keyboard |
| Form           | ExerciseList custom exercise form | ExerciseList.jsx | trimmed non-empty name       | existing component tests       |
| Scrollbar      | Global src/index.css              | DESIGN.md        | bounded library, document    | browser screenshot             |
| CRUD           | App state and handlers            | App.jsx          | library and planned exercise | existing integration tests     |

## Workflows

Adding a library exercise keeps the user in the library and clears the input. Choosing a day appends that exercise with three sets and ten reps, then resets the selector. Editing prescriptions updates the current row. Removals retain the existing immediate behavior; undo and confirmation are tracked follow-up work. Local search and letter selection are transient, with an explicit clear-search action. If a selected letter disappears, show All. A day with no movements is unplanned, never claimed as completed or a scheduled rest day.

## Known follow-up work

Storage reads/writes lack recovery; numbers need positive-integer validation; exercise IDs need collision prevention. No server loading/error states apply yet. Existing tests cover core local interactions. This contract records these limitations rather than asserting they are solved.

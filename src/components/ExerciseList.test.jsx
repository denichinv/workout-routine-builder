import ExerciseList from "./ExerciseList";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

//Mock Data

const mockExercises = [
  {
    id: 1,
    name: "Push-ups",
  },
  {
    id: 2,
    name: "Squats",
  },
  {
    id: 3,
    name: "Lunges",
  },
  {
    id: 4,
    name: "Plank",
  },
  {
    id: 5,
    name: "Deadlifts",
  },
  {
    id: 6,
    name: "Pull-ups",
  },
];

describe("Exercise List Component", () => {
  test("Component renders with exercise list", () => {
    render(
      <ExerciseList
        exercises={mockExercises}
        onAddCustomExercise={jest.fn()}
        onAddExercise={jest.fn()}
        onDeleteExercise={jest.fn()}
      />
    );
    mockExercises.forEach((exercise) => {
      expect(screen.getByText(exercise.name)).toBeInTheDocument();
    });
  });

  test("Search Filters Exercises", async () => {
    const user = userEvent.setup();
    render(
      <ExerciseList
        exercises={mockExercises}
        onAddCustomExercise={jest.fn()}
        onAddExercise={jest.fn()}
        onDeleteExercise={jest.fn()}
      />
    );
    const searchBar = screen.getByPlaceholderText("Search exercises...");
    await user.type(searchBar, "Pla");

    expect(screen.getByText("Plank")).toBeInTheDocument();
    expect(screen.queryByText("Squats")).not.toBeInTheDocument();
    expect(screen.queryByText("Lunges")).not.toBeInTheDocument();
    expect(screen.queryByText("Deadlifts")).not.toBeInTheDocument();
  });

  test("When user clicks a category button", async () => {
    const user = userEvent.setup();

    render(
      <ExerciseList
        exercises={mockExercises}
        onAddCustomExercise={jest.fn()}
        onAddExercise={jest.fn()}
        onDeleteExercise={jest.fn()}
      />
    );

    const filterButtonP = screen.getByText("P");

    await user.click(filterButtonP);
    expect(screen.getByText("Push-ups")).toBeInTheDocument();
    expect(screen.getByText("Plank")).toBeInTheDocument();
    expect(screen.getByText("Pull-ups")).toBeInTheDocument();
    expect(screen.queryByText("Squats")).not.toBeInTheDocument();
    expect(screen.queryByText("Lunges")).not.toBeInTheDocument();
    expect(screen.queryByText("Deadlifts")).not.toBeInTheDocument();
  });

  test("Add Custom Exercise", async () => {
    const user = userEvent.setup();
    const onAddCustomExercise = jest.fn();
    render(
      <ExerciseList
        exercises={mockExercises}
        onAddCustomExercise={onAddCustomExercise}
        onAddExercise={jest.fn()}
        onDeleteExercise={jest.fn()}
      />
    );

    const inputBar = screen.getByPlaceholderText("Exercise name");
    const addButton = screen.getByText("Add");
    await user.type(inputBar, "Dips");
    await user.click(addButton);

    expect(onAddCustomExercise).toHaveBeenCalledWith("Dips");
  });

  test("Delete exercise when user clicks the delete button", async () => {
    const user = userEvent.setup();
    const onDeleteExercise = jest.fn();
    render(
      <ExerciseList
        exercises={mockExercises}
        onAddCustomExercise={jest.fn()}
        onAddExercise={jest.fn()}
        onDeleteExercise={onDeleteExercise}
      />
    );

    const deleteButton = screen.getAllByLabelText("Delete exercise");
    await user.click(deleteButton[0]);
    expect(onDeleteExercise).toHaveBeenCalledWith(1);
  });
});

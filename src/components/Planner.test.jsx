import Planner from "./Planner";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock data
const emptyRoutine = {
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  Sunday: [],
};
const days = Object.keys(emptyRoutine);

const routineWithExercises = {
  Monday: [
    { id: 1, name: "Push-Ups", reps: 10, sets: 3 },
    { id: 2, name: "Pull-Ups", reps: 10, sets: 3 },
    { id: 3, name: "Sit-Ups", reps: 10, sets: 3 },
  ],
  Tuesday: [
    { id: 7, name: "Sit-Ups", reps: 10, sets: 3 },
    { id: 4, name: "Push-Ups", reps: 10, sets: 3 },
    { id: 5, name: "Pull-Ups", reps: 10, sets: 3 },
  ],
  Wednesday: [],
  Thursday: [
    { id: 53, name: "Pull-Ups", reps: 10, sets: 3 },
    { id: 32, name: "Push-Ups", reps: 10, sets: 3 },
    { id: 38, name: "Sit-Ups", reps: 10, sets: 3 },
  ],
  Friday: [],
  Saturday: [],
  Sunday: [],
};

describe("Planner Component", () => {
  test("Component renders with empty routine", () => {
    render(
      <Planner
        routine={emptyRoutine}
        handleRemove={() => {}}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Weekly Plan")).toBeInTheDocument();
  });

  test("Display all 7 days of the week", () => {
    render(
      <Planner
        routine={emptyRoutine}
        handleRemove={() => {}}
        onChange={() => {}}
      />
    );
    days.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test("Shows message if day is empty", () => {
    render(
      <Planner
        routine={emptyRoutine}
        handleRemove={() => {}}
        onChange={() => {}}
      />
    );
    expect(screen.getAllByText("Add exercises")).toHaveLength(days.length);
  });

  test("Displays exercise count badge correctly", () => {
    render(
      <Planner
        routine={routineWithExercises}
        handleRemove={() => {}}
        onChange={() => {}}
      />
    );

    expect(screen.getByText("9 exercises")).toBeInTheDocument();
  });
  test("Renders exercises when routine has data", () => {
    render(
      <Planner
        routine={routineWithExercises}
        handleRemove={() => {}}
        onChange={() => {}}
      />
    );
    expect(screen.getByText("Weekly Plan")).toBeInTheDocument();
    expect(screen.getAllByText("Push-Ups")).toHaveLength(3);
    expect(screen.getAllByText("Pull-Ups")).toHaveLength(3);
    expect(screen.getAllByText("Sit-Ups")).toHaveLength(3);

    expect(screen.getAllByText("Sets").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Reps").length).toBeGreaterThan(0);
  });

  // User Events Tests

  test("calls handleRemove when remove button is clicked", async () => {
    const mockHandleRemove = jest.fn();
    const user = userEvent.setup();

    render(
      <Planner
        routine={routineWithExercises}
        handleRemove={mockHandleRemove}
        onChange={() => {}}
      />
    );

    const removeButtons = screen.getAllByLabelText("Remove exercise");
    await user.click(removeButtons[0]);
    expect(mockHandleRemove).toHaveBeenCalled();
  });

  test("calls onChange when sets input is changed", async () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Planner
        routine={routineWithExercises}
        handleRemove={() => {}}
        onChange={mockOnChange}
      />
    );

    const setFields = screen.getAllByLabelText("Sets");
    const firstSetInput = setFields[0];
    await user.clear(firstSetInput);
    await user.type(firstSetInput, "5");
    expect(mockOnChange).toHaveBeenLastCalledWith(
      "Monday",
      0,
      "sets",
      expect.any(String)
    );
  });

  test("calls onChange when reps input is changed", async () => {
    const mockOnChange = jest.fn();
    const user = userEvent.setup();

    render(
      <Planner
        routine={routineWithExercises}
        handleRemove={() => {}}
        onChange={mockOnChange}
      />
    );

    const repsFields = screen.getAllByLabelText("Reps");
    await userEvent.clear(repsFields[0]);
    await userEvent.type(repsFields[0], "5");
    expect(mockOnChange).toHaveBeenLastCalledWith(
      "Monday",
      0,
      "reps",
      expect.any(String)
    );
  });
});

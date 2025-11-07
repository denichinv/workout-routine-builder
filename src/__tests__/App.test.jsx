import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  test("App renders without crashing", () => {
    render(<App />);

    expect(screen.getByText("Workout Routine Builder")).toBeInTheDocument();
    expect(screen.getByText("Push-ups")).toBeInTheDocument();
    expect(screen.getByText("Squats")).toBeInTheDocument();
  });

  test("Add exercise to a day", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dropdowns = screen.getAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");
    const squatsElements = screen.getAllByText("Squats");
    expect(squatsElements.length).toBeGreaterThan(1);
    expect(screen.getByText("1 exercise")).toBeInTheDocument();
  });
  test("Remove exercise from a day", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dropdowns = screen.getAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");

    const removeButton = screen.getByLabelText("Remove exercise");

    await user.click(removeButton);
    expect(removeButton).not.toBeInTheDocument();
    expect(screen.getByText("0 exercises")).toBeInTheDocument();
  });
  test("Change sets/reps from day for exercise", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dropdowns = screen.getAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");

    const [setsInput, repsInput] = screen.getAllByRole("spinbutton");

    await user.clear(setsInput);
    await user.clear(repsInput);

    await user.type(setsInput, "5");
    await user.type(repsInput, "12");

    expect(setsInput).toHaveValue(5);
    expect(repsInput).toHaveValue(12);
  });
  test("localStorage persistence", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    const dropdowns = screen.getAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");

    unmount();

    render(<App />);
    expect(screen.getByText("1 exercise")).toBeInTheDocument();
  });
});

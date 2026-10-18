import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { fetchExercises } from "../api/exercises";
import defaultExercises from "../data/exercises";

jest.mock("../api/exercises", () => ({
  fetchExercises: jest.fn(),
}));
describe("App Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    fetchExercises.mockReset();
    fetchExercises.mockResolvedValue(defaultExercises);
  });
  test("App renders without crashing", async () => {
    render(<App />);

    expect(screen.getByText("Workout Routine Builder")).toBeInTheDocument();
    expect(await screen.findByText("Push-ups")).toBeInTheDocument();
    expect(screen.getByText("Squats")).toBeInTheDocument();
  });

  test("Add exercise to a day", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dropdowns = await screen.findAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");
    const squatsElements = screen.getAllByText("Squats");
    expect(squatsElements.length).toBeGreaterThan(1);
    expect(screen.getByText("1 exercise")).toBeInTheDocument();
  });
  test("Remove exercise from a day", async () => {
    const user = userEvent.setup();
    render(<App />);

    const dropdowns = await screen.findAllByRole("combobox");
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

    const dropdowns = await screen.findAllByRole("combobox");
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

    const dropdowns = await screen.findAllByRole("combobox");
    const squatsDropdown = dropdowns[1];
    await user.selectOptions(squatsDropdown, "Monday");

    unmount();

    render(<App />);
    await screen.findAllByRole("combobox");
    expect(screen.getByText("1 exercise")).toBeInTheDocument();
  });

  test("retries loading exercises after a failed request", async () => {
    const user = userEvent.setup();

    fetchExercises
      .mockRejectedValueOnce(
        new Error("Could not load exercises. Please try again."),
      )
      .mockResolvedValueOnce(defaultExercises);

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load exercises. Please try again.",
    );
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("combobox", {
        name: "Add Squats to day",
      }),
    ).toBeInTheDocument();

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(fetchExercises).toHaveBeenCalledTimes(2);
  });
});

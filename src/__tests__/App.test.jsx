import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import defaultExercises from "../data/exercises";
import {
  fetchExercises,
  importExercises,
  createExercise,
  deleteExercise,
} from "../api/exercises";

jest.mock("../api/exercises", () => ({
  fetchExercises: jest.fn(),
  importExercises: jest.fn(),
  createExercise: jest.fn(),
  deleteExercise: jest.fn(),
}));
describe("App Integration Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
    fetchExercises.mockResolvedValue(defaultExercises);
    importExercises.mockResolvedValue(defaultExercises);
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
  test("preserves the name after a failed create and allows retry", async () => {
    const user = userEvent.setup();

    createExercise
      .mockRejectedValueOnce(new Error("Could not add exercise."))
      .mockResolvedValueOnce({ id: 99, name: "Dips" });

    render(<App />);
    await screen.findByRole("combobox", { name: "Add Squats to day" });

    const input = screen.getByLabelText("Add New Exercise");

    await user.type(input, "Dips");
    await user.click(screen.getByRole("button", { name: "Add", exact: true }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not add exercise.",
    );
    expect(input).toHaveValue("Dips");

    await user.click(screen.getByRole("button", { name: "Add", exact: true }));

    expect(
      await screen.findByRole("combobox", { name: "Add Dips to day" }),
    ).toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
  test("keeps an exercise after a failed delete and allows retry", async () => {
    const user = userEvent.setup();

    deleteExercise
      .mockRejectedValueOnce(new Error("Could not delete exercise."))
      .mockResolvedValueOnce(undefined);

    render(<App />);
    await screen.findByRole("combobox", { name: "Add Push-ups to day" });

    await user.click(
      screen.getAllByRole("button", {
        name: "Delete exercise",
        exact: true,
      })[0],
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not delete exercise.",
    );
    expect(
      screen.getByRole("combobox", { name: "Add Push-ups to day" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", {
        name: "Delete exercise",
        exact: true,
      })[0],
    );

    await screen.findByText("5");
    expect(
      screen.queryByRole("combobox", { name: "Add Push-ups to day" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

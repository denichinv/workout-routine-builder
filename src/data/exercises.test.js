import defaultExercises from "./exercises";

describe("Default Exercises", () => {
  test("The default exercises array exists", () => {
    expect(defaultExercises).toBeDefined();
  });

  it("Has 6 default exercises", () => {
    expect(defaultExercises.length).toEqual(6);
  });
  test("Each exercise has the correct structure", () => {
    defaultExercises.forEach((exercise) => {
      expect(exercise).toHaveProperty("id");
      expect(exercise).toHaveProperty("name");
      expect(typeof exercise.id).toBe("number");
      expect(typeof exercise.name).toBe("string");
    });
  });
  test("ID uniqueness", () => {
    const allIds = defaultExercises.map((exercise) => exercise.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(defaultExercises.length);
  });
});

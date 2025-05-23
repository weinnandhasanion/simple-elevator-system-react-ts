import {
  generateRandomNumFromRange,
  generateRandomNumFromRangeExcludingN,
} from "./helpers";

describe("test helpers", () => {
  test("generateRandomNumFromRange", () => {
    const val = generateRandomNumFromRange(1, 10);
    expect(val).not.toBeLessThan(1);
    expect(val).not.toBeGreaterThan(10);
  });

  test("generateRandomNumFromRangeExcludingN", () => {
    const min = 1;
    const max = 3;
    const exclude = 2;
    const vals = Array.from({ length: 5 }).map(() =>
      generateRandomNumFromRangeExcludingN(min, max, exclude)
    );
    expect(vals).not.toContain(exclude);
  });
});

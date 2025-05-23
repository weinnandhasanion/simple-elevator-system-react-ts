export const generateRandomNumFromRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateRandomNumFromRangeExcludingN = (
  min: number,
  max: number,
  n: number
) => {
  let rand;

  do {
    rand = generateRandomNumFromRange(min, max);
  } while (rand === n);

  return rand;
};

import { renderHook, act } from "@testing-library/react";
import useElevatorManager from "../hooks/useElevatorManager";
import config from "../config";
import * as helpers from "../util/helpers"; // to mock random generators

jest.useFakeTimers();

jest.mock("../config", () => ({
  _esModule: true,
  default: {
    ...jest.requireActual("../config"),
    delay: 3000,
    requestInterval: 3000,
    elevatorCount: 1,
    floorCount: 2,
  },
}));

describe("useElevatorManager hook", () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("initializes elevators and queue correctly", () => {
    const { result } = renderHook(() => useElevatorManager());
    expect(result.current.elevators).toHaveLength(config.elevatorCount);
    expect(result.current.queue).toEqual([]);
  });

  test("generates random requests on interval and adds to queue", () => {
    jest.spyOn(helpers, "generateRandomNumFromRange").mockReturnValueOnce(2);
    jest
      .spyOn(helpers, "generateRandomNumFromRangeExcludingN")
      .mockReturnValueOnce(4);

    const { result } = renderHook(() => useElevatorManager());

    expect(result.current.queue).toEqual([]);

    act(() => {
      jest.advanceTimersByTime(config.requestInterval);
    });

    expect(result.current.queue.length).toBe(1);
    expect(result.current.queue[0]).toEqual({ from: 2, to: 4 });
  });

  test("assigns requests to idle elevators and removes requests on pickup", () => {
    jest.spyOn(helpers, "generateRandomNumFromRange").mockReturnValue(1);
    jest
      .spyOn(helpers, "generateRandomNumFromRangeExcludingN")
      .mockReturnValue(2);

    const { result } = renderHook(() => useElevatorManager());

    const elevator = result.current.elevators[0];
    expect(elevator.busy).toBe(false);
    expect(elevator.currentFloor).toBe(1);

    act(() => {
      jest.advanceTimersByTime(config.requestInterval);
      jest.advanceTimersByTime(config.tick);
    });

    expect(result.current.queue).toHaveLength(1);
    expect(result.current.elevators[0].busy).toBe(true);
    expect(elevator.currentFloor).toBe(1);
  });
});

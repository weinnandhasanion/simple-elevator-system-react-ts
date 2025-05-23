import { elevatorReducer } from "./elevator";
import { ElevatorState } from "../util/constants";
import type { Elevator, Action } from "../util/types";
import config from "../config";

const now = Date.now();

const createElevator = (
  id: number,
  overrides: Partial<Elevator> = {}
): Elevator => ({
  id,
  currentFloor: 0,
  from: null,
  to: null,
  busy: false,
  hasPassengers: false,
  state: ElevatorState.Idle,
  lastMovedAt: now - config.delay - 1,
  ...overrides,
});

describe("elevatorReducer", () => {
  describe("ASSIGN_REQUEST", () => {
    test("assigns request to idle elevator", () => {
      const state = [createElevator(1)];
      const action: Action = {
        type: "ASSIGN_REQUEST",
        payload: { from: 1, to: 5 },
      };

      const result = elevatorReducer(state, action);
      expect(result[0].from).toBe(1);
      expect(result[0].to).toBe(5);
      expect(result[0].busy).toBe(true);
    });

    test("does not assign if no idle elevators", () => {
      const state = [createElevator(1, { busy: true })];
      const action: Action = {
        type: "ASSIGN_REQUEST",
        payload: { from: 2, to: 4 },
      };

      const result = elevatorReducer(state, action);
      expect(result[0].from).toBeNull();
    });
  });

  describe("PROCESS_NEXT", () => {
    test("moves idle elevator toward pickup floor", () => {
      const state = [
        createElevator(1, {
          from: 2,
          to: 4,
          currentFloor: 0,
          state: ElevatorState.Idle,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].state).toBe(ElevatorState.MovingUp);
    });

    test("increments floor toward pickup", () => {
      const state = [
        createElevator(1, {
          from: 3,
          currentFloor: 1,
          state: ElevatorState.MovingUp,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].currentFloor).toBe(2);
    });

    test("opens door at pickup", () => {
      const state = [
        createElevator(1, {
          from: 2,
          currentFloor: 1,
          state: ElevatorState.MovingUp,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      const next = elevatorReducer(result, { type: "PROCESS_NEXT" });
      expect(next[0].currentFloor).toBe(2);
      expect(next[0].state).toBe(ElevatorState.DoorOpen);
    });

    test("opens door if request is from same floor", () => {
      const state = [
        createElevator(1, {
          from: 1,
          to: 4,
          currentFloor: 1,
          state: ElevatorState.Idle,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].state).toBe(ElevatorState.DoorOpen);
    });

    test("moves toward destination after loading", () => {
      const state = [
        createElevator(1, {
          from: 1,
          to: 3,
          currentFloor: 1,
          state: ElevatorState.DoorOpen,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].state).toBe(ElevatorState.MovingUp);
      expect(result[0].from).toBeNull();
      expect(result[0].hasPassengers).toBe(true);
    });

    test("moves floor by floor toward destination", () => {
      const state = [
        createElevator(1, {
          currentFloor: 1,
          to: 3,
          state: ElevatorState.MovingUp,
          hasPassengers: true,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].currentFloor).toBe(2);
    });

    test("opens door on arrival at destination", () => {
      const state = [
        createElevator(1, {
          currentFloor: 2,
          to: 3,
          state: ElevatorState.MovingUp,
          hasPassengers: true,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      const next = elevatorReducer(result, { type: "PROCESS_NEXT" });
      expect(next[0].currentFloor).toBe(3);
      expect(next[0].state).toBe(ElevatorState.DoorOpen);
    });

    test("resets elevator after dropoff", () => {
      const state = [
        createElevator(1, {
          currentFloor: 4,
          to: 4,
          hasPassengers: true,
          state: ElevatorState.DoorOpen,
          busy: true,
        }),
      ];
      const result = elevatorReducer(state, { type: "PROCESS_NEXT" });
      expect(result[0].busy).toBe(false);
      expect(result[0].state).toBe(ElevatorState.Idle);
      expect(result[0].from).toBeNull();
      expect(result[0].to).toBeNull();
      expect(result[0].hasPassengers).toBe(false);
    });
  });
});

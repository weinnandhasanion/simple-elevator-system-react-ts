import config from "../config";
import { ElevatorState } from "../util/constants";
import type { Elevator, Action } from "../util/types";

export const elevatorReducer = (
  state: Elevator[],
  action: Action
): Elevator[] => {
  switch (action.type) {
    case "ASSIGN_REQUEST": {
      const request = action.payload;
      const idleElevator = state.find((e) => !e.busy);

      if (!idleElevator) return state;

      return state.map((e) =>
        e.id === idleElevator.id
          ? {
              ...e,
              from: request.from,
              to: request.to,
              busy: true,
            }
          : e
      );
    }

    case "PROCESS_NEXT": {
      return state.map((e) => {
        if (!e.busy) return e;

        const now = Date.now();
        const waiting = !(now - e.lastMovedAt >= config.delay);
        if (waiting) return e;

        const log = (message: string) =>
          console.log(`elevator ${e.id} ${message}`);

        // move elevator
        if (
          e.from !== null &&
          e.currentFloor !== e.from &&
          e.to !== null &&
          e.state === ElevatorState.Idle
        ) {
          log(`received request from floor ${e.from}`);
          return {
            ...e,
            state:
              e.from > e.currentFloor
                ? ElevatorState.MovingUp
                : ElevatorState.MovingDown,
            lastMovedAt: now,
          };
        }

        // increment/decrement currentFloor for pickup
        if (
          e.from !== null &&
          e.currentFloor !== e.from &&
          e.state !== ElevatorState.Idle
        ) {
          const nextFloor = e.currentFloor + (e.from > e.currentFloor ? 1 : -1);
          if (nextFloor === e.from) {
            log(`arrived at requesting floor ${e.from}`);
            log("loading passengers");
          } else {
            log(`on floor ${nextFloor}`);
          }

          const state =
            e.from > e.currentFloor
              ? ElevatorState.MovingUp
              : ElevatorState.MovingDown;
          return {
            ...e,
            currentFloor: nextFloor,
            state: nextFloor === e.from ? ElevatorState.DoorOpen : state,
            lastMovedAt: now,
          };
        }

        // process requests from same floor
        if (
          e.from === e.currentFloor &&
          e.to !== null &&
          e.state === ElevatorState.Idle
        ) {
          log(`received request from same floor ${e.from}`);
          log("loading passengers");
          return {
            ...e,
            state: ElevatorState.DoorOpen,
            lastMovedAt: now,
          };
        }

        // move to destination after loading passengers
        if (
          e.from === e.currentFloor &&
          e.to !== null &&
          e.state === ElevatorState.DoorOpen
        ) {
          log(`moving to destination floor ${e.to}`);
          return {
            ...e,
            from: null,
            hasPassengers: true,
            state:
              e.to > e.currentFloor
                ? ElevatorState.MovingUp
                : ElevatorState.MovingDown,
            lastMovedAt: now,
          };
        }

        // increment/decrement currentFloor for dropoff
        if (e.from === null && e.to !== null && e.currentFloor !== e.to) {
          const nextFloor = e.currentFloor + (e.to > e.currentFloor ? 1 : -1);
          if (nextFloor === e.to) {
            log(`arrived at destination floor ${e.to}`);
            log("unloading passengers");
          } else {
            log(`on floor ${nextFloor}`);
          }

          const state =
            e.to > e.currentFloor
              ? ElevatorState.MovingUp
              : ElevatorState.MovingDown;
          return {
            ...e,
            currentFloor: nextFloor,
            state: nextFloor === e.to ? ElevatorState.DoorOpen : state,
            lastMovedAt: now,
          };
        }

        // after dropping passengers
        if (e.to === e.currentFloor && e.to !== null) {
          log("free");
          return {
            ...e,
            from: null,
            to: null,
            hasPassengers: false,
            state: ElevatorState.Idle,
            busy: false,
          };
        }

        return e;
      });
    }

    default:
      return state;
  }
};

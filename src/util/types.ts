import type { ElevatorState } from "./constants";

export type Elevator = {
  id: number;
  busy: boolean;
  state: ElevatorState;
  currentFloor: number;
  from: number | null;
  to: number | null;
  hasPassengers: boolean;
  lastMovedAt: number;
};

export type FloorRequest = {
  from: number;
  to: number;
};

export type Action =
  | { type: "PROCESS_NEXT" }
  | { type: "ASSIGN_REQUEST"; payload: FloorRequest }
  | { type: "ADD_REQUEST"; payload: FloorRequest }
  | { type: "PICKUP_REQUEST"; payload: FloorRequest };

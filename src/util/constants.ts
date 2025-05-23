export enum ElevatorState {
  Idle = 0,
  MovingUp = 1,
  MovingDown = 2,
  DoorOpen = 3,
}

export enum ElevatorMode {
  Pickup = 0,
  Dropoff = 1,
}

export enum Direction {
  UP = 1,
  DOWN = 2,
}

export const STATE_DESC = {
  [ElevatorState.Idle]: "",
  [ElevatorState.DoorOpen]: "...",
  [ElevatorState.MovingUp]: "^",
  [ElevatorState.MovingDown]: "⌄",
} as const;

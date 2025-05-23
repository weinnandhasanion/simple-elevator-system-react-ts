import { render } from "@testing-library/react";
import Floor from "./Floor";
import { createElevator } from "../hooks/useElevatorManager";
import { ElevatorState, STATE_DESC } from "../util/constants";

describe("Floor component", () => {
  const elevators = [
    {
      ...createElevator(1),
      currentFloor: 2,
      from: 2,
      to: 3,
      state: ElevatorState.MovingUp,
    },
    {
      ...createElevator(2),
      currentFloor: 2,
      to: 1,
      state: ElevatorState.DoorOpen,
    },
  ];
  const queue = [
    { from: 2, to: 3 },
    { from: 2, to: 1 },
  ];

  test("renders floor with elevators", () => {
    const { container } = render(
      <Floor floorNo={2} elevators={elevators} queue={queue} />
    );

    expect(container).toHaveTextContent("Floor 2");
    expect(container).toHaveTextContent(STATE_DESC[ElevatorState.MovingUp]);
    expect(container).toHaveTextContent(STATE_DESC[ElevatorState.MovingDown]);
    elevators.forEach(({ state }) => {
      expect(container).toHaveTextContent(`${STATE_DESC[state]}`);
    });
  });
});

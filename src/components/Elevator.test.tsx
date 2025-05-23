import { render } from "@testing-library/react";
import { createElevator } from "../hooks/useElevatorManager";
import { Elevator as ElevatorType } from "../util/types";
import Elevator from "./Elevator";
import { ElevatorState, STATE_DESC } from "../util/constants";

describe("Elevator component", () => {
  const mount = (overrides: Partial<ElevatorType>) => {
    const props = { ...createElevator(1), ...overrides };

    return render(<Elevator {...props} />);
  };

  test("renders elevator properly", () => {
    const { container } = mount({ from: 6, hasPassengers: true });

    expect(container).toHaveTextContent("6 !!!");
  });

  [
    ElevatorState.DoorOpen,
    ElevatorState.MovingUp,
    ElevatorState.MovingDown,
  ].forEach((state) => {
    test(`should render ${STATE_DESC[state]}`, () => {
      const { container } = mount({ state });

      expect(container).toHaveTextContent(STATE_DESC[state]);
    });
  });
});

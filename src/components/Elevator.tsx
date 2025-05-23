import { STATE_DESC } from "../util/constants";
import type { Elevator as ElevatorType } from "../util/types";

const Elevator = ({ from, state, hasPassengers }: ElevatorType) => {
  return (
    <div className="border-red-500 border-1 p-3 h-24 w-18">
      <span>
        {STATE_DESC[state]} {!!from && from} {hasPassengers && "!!!"}
      </span>
    </div>
  );
};

export default Elevator;

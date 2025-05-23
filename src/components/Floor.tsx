import type { Elevator as ElevatorType, FloorRequest } from "../util/types";
import { ElevatorState, STATE_DESC } from "../util/constants";
import Elevator from "./Elevator";

const Floor = ({
  floorNo,
  elevators,
  queue,
}: {
  floorNo: number;
  elevators: ElevatorType[];
  queue: FloorRequest[];
}) => {
  const hasUpRequest = !!queue.find(
    ({ from, to }) => from === floorNo && to > from
  );
  const hasDownRequest = !!queue.find(
    ({ from, to }) => from === floorNo && to < from
  );

  return (
    <div className="p-5 border-black border-1 h-36 w-full">
      <div className="grid grid-cols-12 gap-2">
        <p className="col-span-2">Floor {floorNo}</p>
        <div className="col-span-2 flex flex-col">
          {hasUpRequest && <span>{STATE_DESC[ElevatorState.MovingUp]}</span>}
          {hasDownRequest && (
            <span>{STATE_DESC[ElevatorState.MovingDown]}</span>
          )}
        </div>
        {elevators.map((elevator) => (
          <div className="col-span-2" key={`${floorNo}-${elevator.id}`}>
            {elevator.currentFloor === floorNo && <Elevator {...elevator} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Floor;

import { useEffect, useReducer } from "react";
import { ElevatorState } from "../util/constants";
import type { Elevator } from "../util/types";
import {
  generateRandomNumFromRange,
  generateRandomNumFromRangeExcludingN,
} from "../util/helpers";
import { queueReducer } from "../reducer/queue";
import { elevatorReducer } from "../reducer/elevator";
import config from "../config";

export const createElevator = (id: number): Elevator => ({
  id,
  currentFloor: 1,
  state: ElevatorState.Idle,
  from: null,
  to: null,
  busy: false,
  hasPassengers: false,
  lastMovedAt: Date.now(),
});

const useElevatorManager = () => {
  const [queue, dispatchQueue] = useReducer(queueReducer, []);
  const [elevators, dispatchElevator] = useReducer(
    elevatorReducer,
    Array.from({ length: config.elevatorCount }, (_, i) =>
      createElevator(i + 1)
    )
  );

  // random request generator
  useEffect(() => {
    const generateRequest = () => {
      const from = generateRandomNumFromRange(1, config.floorCount);
      const to = generateRandomNumFromRangeExcludingN(
        1,
        config.floorCount,
        from
      );

      dispatchQueue({ type: "ADD_REQUEST", payload: { from, to } });
    };

    const interval = setInterval(generateRequest, config.requestInterval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!queue.length) return;

    // remove requests from queue upon pickup
    queue.forEach(({ from, to }) => {
      elevators.forEach((elevator) => {
        if (
          elevator.from === null &&
          elevator.to === to &&
          elevator.currentFloor === from
        ) {
          dispatchQueue({
            type: "PICKUP_REQUEST",
            payload: { from: elevator.currentFloor, to: elevator.to },
          });
        }
      });
    });

    // assign requests to elevators upon populating queue
    const nextRequest = queue.find(({ from, to }) =>
      elevators.every(
        (elevator) => elevator.from !== from && elevator.to !== to
      )
    );

    if (nextRequest) {
      dispatchElevator({ type: "ASSIGN_REQUEST", payload: nextRequest });
    }
  }, [elevators, queue]);

  // simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      dispatchElevator({ type: "PROCESS_NEXT" });
    }, config.tick);

    return () => clearInterval(interval);
  }, []);

  return { queue, elevators };
};

export default useElevatorManager;

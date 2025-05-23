import useElevatorManager from "../hooks/useElevatorManager";
import config from "../config";
import Floor from "./Floor";

const ElevatorSystem = () => {
  const { queue, elevators } = useElevatorManager();

  return (
    <div className="container flex flex-col-reverse gap-2 items-center w-xl">
      {Array.from({ length: config.floorCount }).map((_, i) => (
        <Floor key={i} queue={queue} elevators={elevators} floorNo={i + 1} />
      ))}
    </div>
  );
};

export default ElevatorSystem;

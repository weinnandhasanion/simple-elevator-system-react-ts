import { queueReducer } from "./queue";
import type { Action, FloorRequest } from "../util/types";

describe("queueReducer", () => {
  const initialState: FloorRequest[] = [
    { from: 0, to: 3 },
    { from: 1, to: 4 },
  ];

  test("adds a new request when no duplicate exists", () => {
    const newRequest: FloorRequest = { from: 2, to: 5 };
    const action: Action = { type: "ADD_REQUEST", payload: newRequest };
    const newState = queueReducer(initialState, action);
    expect(newState).toEqual([...initialState, newRequest]);
  });

  test("should not add duplicate request", () => {
    const duplicateRequest: FloorRequest = { from: 0, to: 5 };
    const action: Action = { type: "ADD_REQUEST", payload: duplicateRequest };
    const newState = queueReducer(initialState, action);
    expect(newState).toEqual(initialState);

    const downInitialState: FloorRequest[] = [{ from: 2, to: 0 }];
    const duplicateDown: FloorRequest = { from: 2, to: -1 };
    const actionDown: Action = { type: "ADD_REQUEST", payload: duplicateDown };
    const newStateDown = queueReducer(downInitialState, actionDown);
    expect(newStateDown).toEqual(downInitialState);
  });

  test("removes a request on PICKUP_REQUEST", () => {
    const action: Action = {
      type: "PICKUP_REQUEST",
      payload: { from: 0, to: 3 },
    };
    const newState = queueReducer(initialState, action);
    expect(newState).toEqual([{ from: 1, to: 4 }]);
  });
});

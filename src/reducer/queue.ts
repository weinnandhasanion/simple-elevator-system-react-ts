import type { Action, FloorRequest } from "../util/types";

export const queueReducer = (
  state: FloorRequest[],
  action: Action
): FloorRequest[] => {
  switch (action.type) {
    case "ADD_REQUEST": {
      const request = action.payload;
      if (
        state.find(
          ({ from, to }) =>
            from === request.from &&
            ((to < from && request.to < request.from) ||
              (to > from && request.to > request.from))
        )
      )
        return state;

      return [...state, request];
    }

    case "PICKUP_REQUEST": {
      const request = action.payload;
      return state.filter(
        ({ from, to }) => !(from === request.from && to === request.to)
      );
    }

    default:
      return state;
  }
};

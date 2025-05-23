import { render } from "@testing-library/react";
import Building from "./Building";

jest.mock("../config", () => ({
  _esModule: true,
  default: {
    ...jest.requireActual("../config"),
    floorCount: 3,
  },
}));

describe("Building component", () => {
  test("renders floors", () => {
    const { container } = render(<Building />);

    expect(container).toHaveTextContent("Floor 1");
    expect(container).toHaveTextContent("Floor 2");
    expect(container).toHaveTextContent("Floor 3");
  });
});

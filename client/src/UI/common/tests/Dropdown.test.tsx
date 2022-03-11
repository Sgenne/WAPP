import Dropdown from "../Dropdown";
import { render, screen } from "@testing-library/react";

test("Dropdown is hidden if show prop is false.", async () => {
  const options = [
    {
      title: "Title1",
      onClick: () => {},
      icon: <i />,
    },
  ];

  render(<Dropdown options={options} show={false} />);

  expect(screen.getByRole("list")).toHaveClass("hide");
});

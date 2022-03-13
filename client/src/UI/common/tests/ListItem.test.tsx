import { render, screen } from "@testing-library/react";
import { Children } from "react";
import ListItem from "../ListItem";

test("Is contetnt of listItem shown", async () => {
  const input = { header: "Nice header", content: "This item is but a test" };

  render(<ListItem header={input.header} content={input.content} />);

  const element = screen.getByText(input.content);

  expect(element).toHaveClass("profile-list-item__content");
});

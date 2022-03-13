import ErrorMessage from "../ErrorMessage";
import { render, screen } from "@testing-library/react";
import { Children } from "react";

test("Error message is diplayed", async () => {
  const errorMessage = "Error world";

  render(<ErrorMessage>{errorMessage}</ErrorMessage>);

  const element = screen.getByText(errorMessage);

  expect(element).toHaveClass("error-message");
});

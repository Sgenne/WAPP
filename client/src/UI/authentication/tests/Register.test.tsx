import { render, screen } from "@testing-library/react";
import Register from "../Register";

test("Submit button is disabled initially disabled.", () => {
  render(<Register />);

  expect(screen.getByRole("button", { name: "Register" })).toHaveProperty(
    "disabled",
    true
  );
});

// test("Submit button is disabled until all inputs have content", async () => {
//   render(<Register />);

//   userEvent.type(screen.getByPlaceholderText("Enter a username"), "HamSam");
//   userEvent.type(
//     screen.getByPlaceholderText("Enter a password"),
//     "supersecurepassword"
//   );
//   userEvent.type(
//     screen.getByPlaceholderText("Enter your email"),
//     "ham.sam@gmail.com"
//   );

//   // Entering input into datepicker with testing-library does not work...
//   // Known bug with the library.
//   userEvent.click(screen.getByPlaceholderText("Enter your date of birth:"));
//   userEvent.type(
//     screen.getByPlaceholderText("Enter your date of birth:"),
//     "26081996"
//   );

// //   expect(screen.getByRole("button", { name: "Register" })).not.toHaveProperty(
// //     "disabled"
// //   );
// });

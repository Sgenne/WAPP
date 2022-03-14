import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../Modal";

test("Backraound click triggers function", async () => {
  let isBackgroundClicked = false;
  function backgroundClicked() {
    isBackgroundClicked = true;
  }
  const { container } = render(
    <div>
      <h1>Header</h1>
      <Modal onBackgroundClick={backgroundClicked}>
        <div>Content</div>
      </Modal>
    </div>
  );
  const background = container.querySelector(".modal__background");

  if (!background) throw new Error("Could not find background.");

  await userEvent.click(background);
  expect(isBackgroundClicked).toBe(true);
});

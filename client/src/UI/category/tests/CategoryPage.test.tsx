import { render, screen } from "@testing-library/react";
import { rest } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Category } from "../../../../../server/src/model/category.interface";
import { Thread } from "../../../../../server/src/model/thread.interface";
import CategoryPage from "../CategoryPage";
import { setupServer } from "msw/node";
import { User } from "../../../../../server/src/model/user.interface";
import userEvent from "@testing-library/user-event";

const DUMMY_CATEGORY: Category = {
  title: "Cats",
  description: "Category about cats.",
};

const DUMMY_CATEGORY_THREAD0: Thread = {
  likes: 2,
  dislikes: 0,
  title: "Title",
  content: "This is a thread about cats",
  author: 0,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 0,
};

const DUMMY_CATEGORY_THREAD1: Thread = {
  likes: 1,
  dislikes: 1,
  title: "Title1",
  content: "This is another thread about cats",
  author: 0,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 1,
};

const DUMMY_CATEGORY_THREAD2: Thread = {
  likes: 0,
  dislikes: 0,
  title: "Title2",
  content: "This is a third thread about cats",
  author: 0,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 2,
};

const DUMMY_USER: User = {
  userId: 1646911445626,
  username: "Simon",
  email: "samham@test.com",
  joinDate: new Date("2022-03-10T11:24:05.737Z"),
  birthDate: new Date("1212-12-12T00:00:00.000Z"),
  bio: "",
  passwordHash: "$2a$10$lkLiuOsASFsSRzIOE2nc8eNGdEPWdEWS/q7q3XnLZXmUiUV0O6p6G",
  profilePicture: {
    imageUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
    filename: "blank-profile-picture-973460_640.png",
    isDefault: true,
  },
  likedThreads: [1646852343812, 1646851482806],
  dislikedThreads: [1646850763703],
  likedComments: [1646851360127],
  dislikedComments: [],
  visibleProperties: {
    email: true,
    joinDate: true,
    birthDate: true,
    bio: true,
    profilePicture: true,
    likedThreads: true,
    dislikedThreads: true,
  },
};

const server = setupServer(
  rest.get(
    "http://localhost:8080/thread/categoryThreads/" + DUMMY_CATEGORY.title,
    (req, res, ctx) =>
      res(
        ctx.json({
          threads: [
            DUMMY_CATEGORY_THREAD0,
            DUMMY_CATEGORY_THREAD1,
            DUMMY_CATEGORY_THREAD2,
          ],
        })
      )
  ),
  rest.get(
    "http://localhost:8080/thread/categoryDetails/" + DUMMY_CATEGORY.title,
    (req, res, ctx) =>
      res(
        ctx.json({
          category: DUMMY_CATEGORY,
        })
      )
  ),
  rest.get("http://localhost:8080/user/0", (req, res, ctx) =>
    res(
      ctx.json({
        user: DUMMY_USER,
      })
    )
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("All threads returned from the backend are shown.", async () => {
  mountPage();

  expect(await screen.findByText(DUMMY_CATEGORY_THREAD0.content)).toBeVisible();
  expect(screen.getByText(DUMMY_CATEGORY_THREAD1.content)).toBeVisible();
  expect(screen.getByText(DUMMY_CATEGORY_THREAD2.content)).toBeVisible();
});

test("Clicking new thread button updates the url.", async () => {
  render(
    <MemoryRouter initialEntries={[`/${DUMMY_CATEGORY.title}`]}>
      <Routes>
        <Route path="/:category" element={<CategoryPage />} />
        <Route
          path={`/create-thread/${DUMMY_CATEGORY.title}`}
          element={<div>NEW THREAD</div>}
        />
      </Routes>
    </MemoryRouter>
  );

  await screen.findByText(DUMMY_CATEGORY.title);

  userEvent.click(screen.getByRole("button", { name: "Thread" }));

  expect(await screen.findByText("NEW THREAD")).toBeVisible();
});

const mountPage = (): JSX.Element => {
  const memoryRouter = (
    <MemoryRouter initialEntries={[`/${DUMMY_CATEGORY.title}`]}>
      <Routes>
        <Route path="/:category" element={<CategoryPage />} />
      </Routes>
    </MemoryRouter>
  );

  render(memoryRouter);

  return memoryRouter;
};

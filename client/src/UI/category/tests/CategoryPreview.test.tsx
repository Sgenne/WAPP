import CategoryPreview from "../CategoryPreview";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { Category } from "../../../../../server/src/model/category.interface";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Thread } from "../../../../../server/src/model/thread.interface";
import { User } from "../../../../../server/src/model/user.interface";

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

const DUMMY_AUTHOR: User = {
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
    "http://localhost:8080/thread/sampleThreads/" + DUMMY_CATEGORY.title,
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
  rest.get("http://localhost:8080/user/0", (req, res, ctx) => {
    return res(
      ctx.json({
        user: DUMMY_AUTHOR,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("The thread returned from the backend is displayed", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={<CategoryPreview category={DUMMY_CATEGORY} />}
        />
      </Routes>
    </MemoryRouter>
  );

  expect(await screen.findByText(DUMMY_CATEGORY_THREAD0.title)).toBeVisible();
  expect(await screen.findByText(DUMMY_CATEGORY_THREAD1.title)).toBeVisible();
  expect(await screen.findByText(DUMMY_CATEGORY_THREAD2.title)).toBeVisible();
  expect((await screen.findAllByText(DUMMY_AUTHOR.username))[0]).toBeVisible();
});

// The returned thread is displayed

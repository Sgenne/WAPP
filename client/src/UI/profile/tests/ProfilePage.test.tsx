import { cleanup, prettyDOM, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Comment } from "../../../../../server/src/model/comment.interface";
import { Thread } from "../../../../../server/src/model/thread.interface";
import { User } from "../../../../../server/src/model/user.interface";
import ProfilePage from "../ProfilePage";

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

const DUMMY_CREATED_THREAD: Thread = {
  likes: 0,
  dislikes: 0,
  title: "Created thread title",
  content: "This is a created thread",
  author: 1646911445626,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 2,
};

const DUMMY_LIKED_THREAD: Thread = {
  likes: 0,
  dislikes: 0,
  title: "Liked thread title",
  content: "This is a liked thread",
  author: 16469187,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 2,
};

const DUMMY_CREATED_COMMENT: Comment = {
  content: "This is a created comment.",
  author: 1646911445626,
  date: new Date(),
  replies: [],
  likes: 0,
  dislikes: 0,
  commentId: 1647079031291,
  isDeleted: false,
  rootThread: 1647073610149,
};

const DUMMY_LIKED_COMMENT: Comment = {
  content: "This is a liked comment.",
  author: 1646933336,
  date: new Date(),
  replies: [],
  likes: 0,
  dislikes: 0,
  commentId: 16470790432,
  isDeleted: false,
  rootThread: 164707149,
};

const server = setupServer(
  rest.get(
    "http://localhost:8080/user/username/" + DUMMY_USER.username,
    (req, res, ctx) =>
      res(
        ctx.json({
          user: DUMMY_USER,
        })
      )
  ),
  rest.get(
    `http://localhost:8080/thread/author/${DUMMY_USER.userId}`,
    (req, res, ctx) =>
      res(
        ctx.json({
          threads: [DUMMY_CREATED_THREAD],
        })
      )
  ),
  rest.get(
    `http://localhost:8080/comment/author/${DUMMY_USER.userId}`,
    (req, res, ctx) =>
      res(
        ctx.json({
          comments: [DUMMY_CREATED_COMMENT],
        })
      )
  ),
  rest.get(
    `http://localhost:8080/thread/liked/${DUMMY_USER.userId}`,
    (req, res, ctx) =>
      res(
        ctx.json({
          threads: [DUMMY_LIKED_THREAD],
        })
      )
  ),
  rest.get(
    `http://localhost:8080/comment/likedComments/${DUMMY_USER.userId}`,
    (req, res, ctx) =>
      res(
        ctx.json({
          comments: [DUMMY_LIKED_COMMENT],
        })
      )
  )
);

beforeAll(() => server.listen());
beforeEach(() => mountPage());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

test("The page initially displays the threads created by the owner.", async () => {
  expect(await screen.findByText(DUMMY_CREATED_THREAD.content)).toBeVisible();
  expect(
    screen.queryByText(DUMMY_CREATED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_LIKED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_LIKED_THREAD.content)
  ).not.toBeInTheDocument();
});

test("Clicking liked threads shows threads liked by the owner.", async () => {
  await screen.findByText(DUMMY_CREATED_THREAD.content);
  userEvent.click(screen.getByRole("button", { name: "Liked Threads" }));
  expect(
    await screen.findByText(DUMMY_LIKED_THREAD.content, undefined, {
      timeout: 5000,
    })
  ).toBeVisible();
  expect(
    screen.queryByText(DUMMY_CREATED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_LIKED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_CREATED_THREAD.content)
  ).not.toBeInTheDocument();
});

test("Clicking comments shows the comments created by the owner.", async () => {
  await screen.findByText(DUMMY_CREATED_THREAD.content);
  userEvent.click(screen.getByRole("button", { name: "Comments" }));
  expect(
    await screen.findByText(DUMMY_CREATED_COMMENT.content, undefined, {
      timeout: 5000,
    })
  ).toBeVisible();
  expect(
    screen.queryByText(DUMMY_LIKED_THREAD.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_LIKED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_CREATED_THREAD.content)
  ).not.toBeInTheDocument();
});

test("Clicking liked comments shows the comments liked by the owner.", async () => {
  await screen.findByText(DUMMY_CREATED_THREAD.content, undefined, {timeout: 1000});

  userEvent.click(screen.getByRole("button", { name: "Liked Comments" }));
  expect(
    await screen.findByText(DUMMY_LIKED_COMMENT.content, undefined, {
      timeout: 1000,
    })
  ).toBeVisible();
  expect(
    screen.queryByText(DUMMY_LIKED_THREAD.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_CREATED_COMMENT.content)
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(DUMMY_CREATED_THREAD.content)
  ).not.toBeInTheDocument();
});

const mountPage = () =>
  render(
    <MemoryRouter initialEntries={[`/${DUMMY_USER.username}`]}>
      <Routes>
        <Route path="/:username" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>
  );

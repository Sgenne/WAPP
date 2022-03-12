import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { useState } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Thread } from "../../../../../server/src/model/thread.interface";
import { User } from "../../../../../server/src/model/user.interface";
import { AuthContext } from "../../../context/AuthContext";
import ThreadPreview from "../ThreadPreview";

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
  likedThreads: [],
  dislikedThreads: [],
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

const DUMMY_THREAD: Thread = {
  likes: 0,
  dislikes: 0,
  title: "Thread title",
  content: "This is a thread",
  author: 1646911445626,
  date: new Date(),
  category: 0,
  replies: [],
  threadId: 0,
};

const MOCK_AUTH_CONTEXT_PROVIDER = ({
  children,
  user,
}: {
  children: JSX.Element;
  user: User;
}) => {
  const [signedInUser, setSignedInUser] = useState<User | undefined>(user);

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: true,
        setIsSignedIn: () => {},
        signedInUser,
        setSignedInUser,
        password: "supersecurepassword",
        setPassword: () => {},
        showSignIn: false,
        setShowSignIn: () => {},
        showRegister: false,
        setShowRegister: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
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
  )
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

test("Clicking like changes the appearance of the like button.", () => {
  const initialLikes = 0;
  const initialDislikes = 0;

  mount({
    likes: initialLikes,
    dislikes: initialDislikes,
    likedThreads: [],
    dislikedThreads: [],
  });

  const likeButton = screen.getAllByRole("button")[0];

  expect(likeButton).not.toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent(initialLikes.toString());

  userEvent.click(likeButton);

  expect(likeButton).toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent((initialLikes + 1).toString());
});

test("Clicking dislike changes the appearanace of the dislike button.", () => {
  const initialLikes = 0;
  const initialDislikes = 0;

  mount({
    likes: initialLikes,
    dislikes: initialDislikes,
    likedThreads: [],
    dislikedThreads: [],
  });

  const dislikeButton = screen.getAllByRole("button")[1];

  expect(dislikeButton).not.toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent(initialLikes.toString());

  userEvent.click(dislikeButton);

  expect(dislikeButton).toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent((initialDislikes + 1).toString());
});

test("Liking a previously disliked thread increments the likes and decrements the dislikes.", () => {
  const initialLikes = 0;
  const initialDislikes = 1;
  const initialLikedThreads: number[] = [];
  const initialDislikedThreads = [0];

  mount({
    likes: initialLikes,
    dislikes: initialDislikes,
    likedThreads: initialLikedThreads,
    dislikedThreads: initialDislikedThreads,
  });

  const likeButton = screen.getAllByRole("button")[0];
  const dislikeButton = screen.getAllByRole("button")[1];

  expect(likeButton).not.toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent(initialLikes.toString());
  expect(dislikeButton).toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent(initialDislikes.toString());

  userEvent.click(likeButton);

  expect(likeButton).toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent((initialLikes + 1).toString());
  expect(dislikeButton).not.toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent((initialDislikes - 1).toString());
});

test("Disliking a previously liked thread increments the dislikes and decrements the likes.", () => {
  const initialLikes = 1;
  const initialDislikes = 0;
  const initialLikedThreads = [0];
  const initialDislikedThreads: number[] = [];

  mount({
    likes: initialLikes,
    dislikes: initialDislikes,
    likedThreads: initialLikedThreads,
    dislikedThreads: initialDislikedThreads,
  });

  const likeButton = screen.getAllByRole("button")[0];
  const dislikeButton = screen.getAllByRole("button")[1];

  expect(likeButton).toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent(initialLikes.toString());
  expect(dislikeButton).not.toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent(initialDislikes.toString());

  userEvent.click(dislikeButton);

  expect(likeButton).not.toHaveClass("like-button--highlight");
  expect(likeButton).toHaveTextContent((initialLikes - 1).toString());
  expect(dislikeButton).toHaveClass("dislike-button--highlight");
  expect(dislikeButton).toHaveTextContent((initialDislikes + 1).toString());
});

const mount = (initialState: {
  likes: number;
  dislikes: number;
  likedThreads: number[];
  dislikedThreads: number[];
}) => {
  const thread = {
    ...DUMMY_THREAD,
    likes: initialState.likes,
    dislikes: initialState.dislikes,
  };

  const user = {
    ...DUMMY_USER,
    likedThreads: initialState.likedThreads,
    dislikedThreads: initialState.dislikedThreads,
  };

  return render(
    <MOCK_AUTH_CONTEXT_PROVIDER user={user}>
      <MemoryRouter initialEntries={[`/`]}>
        <Routes>
          <Route path="/" element={<ThreadPreview thread={thread} />} />
        </Routes>
      </MemoryRouter>
    </MOCK_AUTH_CONTEXT_PROVIDER>
  );
};

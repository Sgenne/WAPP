import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { User } from "../../../../server/src/model/user.interface";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatUtils";
import ErrorMessage from "../common/ErrorMessage";
import parse from "html-react-parser";

const ThreadPreview = (props: { thread: Thread }): JSX.Element => {
  const [user, setUser] = useState<User>();
  const [errorMessage, setErrorMessage] = useState("");
  const [likes, setLikes] = useState(props.thread.likes);
  const [dislikes, setDislikes] = useState(props.thread.dislikes);
  const [isFetching, setIsFetching] = useState(false);

  async function getUser(): Promise<void> {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + props.thread.author, {});
    } catch (error) {
      console.log(error);
    }
    setUser(threadResult.data.user);
  }

  let threadResult: AxiosResponse;
  let userImage;

  useEffect((): void => {
    getUser();
  }, []);

  let author;
  if (user) {
    author = user?.username;

    userImage = user.profilePicture.imageUrl;
  }
  const authContext = useContext(AuthContext);
  const signedInUser = authContext.signedInUser;

  const title: string = props.thread.title;
  const context: string = props.thread.content;
  const id: string = "/thread/" + props.thread.threadId;
  const date = props.thread.date;

  const likeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }

    if (!signedInUser) {
      setErrorMessage("You need to sign in to like");
      return;
    }

    if (signedInUser.likedThreads.includes(props.thread.threadId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedThreads: prevUser.likedThreads.filter(
            (likedId) => likedId !== props.thread.threadId
          ),
        };
      });
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedThreads: [...prevUser.likedThreads, props.thread.threadId],
        };
      });
      setLikes((prevLikes) => prevLikes + 1);
    }

    if (signedInUser.dislikedThreads.includes(props.thread.threadId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedThreads: prevUser.dislikedThreads.filter(
            (dislikedId) => dislikedId !== props.thread.threadId
          ),
        };
      });

      setDislikes((prevDislikes) => prevDislikes - 1);
    }
    let likeResult: AxiosResponse;
    setIsFetching(true);
    try {
      likeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/likeThread/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          threadId: props.thread.threadId,
          username: signedInUser.username,
        }
      );
      setErrorMessage("");
    } catch (error) {
      setIsFetching(false);
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong while liking.");
        return;
      }
      setErrorMessage(error.response.data.message);
      console.log(error);
      return;
    }
    setLikes(likeResult.data.thread.likes);
    setIsFetching(false);
  };

  const dislikeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }

    if (!signedInUser) {
      setErrorMessage("You need to sign in to dislike");
      return;
    }

    if (signedInUser.dislikedThreads.includes(props.thread.threadId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedThreads: prevUser.dislikedThreads.filter(
            (dislikedId) => dislikedId !== props.thread.threadId
          ),
        };
      });
      setDislikes((prevDislikes) => prevDislikes - 1);
    } else {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedThreads: [...prevUser.dislikedThreads, props.thread.threadId],
        };
      });
      setDislikes((prevDislikes) => prevDislikes + 1);
    }

    if (signedInUser.likedThreads.includes(props.thread.threadId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedThreads: prevUser.likedThreads.filter(
            (likedId) => likedId !== props.thread.threadId
          ),
        };
      });

      setLikes((prevLikes) => prevLikes - 1);
    }

    let dislikeResult: AxiosResponse;
    setIsFetching(true);
    try {
      dislikeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/dislikeThread/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          threadId: props.thread.threadId,
          username: signedInUser.username,
        }
      );
      setErrorMessage("");
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong when disliking.");
        return;
      }

      setErrorMessage(error.response.data.message);
      console.log(error);
      return;
    }
    setIsFetching(false);
  };

  const likeButtonClassName =
    signedInUser && signedInUser.likedThreads.includes(props.thread.threadId)
      ? "generalButton like-button--highlight"
      : "generalButton";

  const dislikeButtonClassName =
    signedInUser && signedInUser.dislikedThreads.includes(props.thread.threadId)
      ? "generalButton dislike-button--highlight"
      : "generalButton";

  return (
    <li>
      <div className="category-thread container-fluid px-4">
        <div className="row">
          <img src={userImage} className="row__avatar" alt="Profile" />
          <div className="col row">
            <h3 className="thread-title col-12">
              <NavLink to={id} className="link">
                {title}
              </NavLink>
            </h3>
            <p className="row__thread-title col-3">
              <NavLink to={`/profile/${author}`} className="link">
                {author}
              </NavLink>
            </p>
            <p className="row__thread-title col-7">
              {formatDate(new Date(date))}
            </p>
          </div>
        </div>
        <div className="category-box__thread-desc threadPrevCont">
          {parse(context)}
        </div>
        <div>
          <button className={likeButtonClassName} onClick={likeClickHandler}>
            <FaThumbsUp />
            <p className="threadLikes">{likes}</p>
          </button>
          <button
            className={dislikeButtonClassName}
            onClick={dislikeClickHandler}
          >
            <FaThumbsDown />
            <p className="threadLikes">{dislikes}</p>
          </button>
        </div>
        <div>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
      </div>
    </li>
  );
};

export default ThreadPreview;

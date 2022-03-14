import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useParams } from "react-router";
import { Thread } from "../../../../server/src/model/thread.interface";
import { User } from "../../../../server/src/model/user.interface";
import { Comment } from "../../../../server/src/model/comment.interface";
import ThreadComment from "./ThreadComment";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import ErrorMessage from "../common/ErrorMessage";
import { formatDate } from "../../utils/formatUtils";
import parse from "html-react-parser";

const ThreadPage = (): JSX.Element => {
  const [user, setuser] = useState<User>();
  const [threadObject, setThreadObject] = useState<Thread>();
  const [comments, setComments] = useState<Comment[]>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const navigate = useNavigate();
  const param = useParams();
  const authContext = useContext(AuthContext);
  const signedInUser = authContext.signedInUser;
  const id = param.threadId;

  useEffect((): void => {
    const getThread = async (): Promise<void> => {
      let threadResult: AxiosResponse;
      try {
        threadResult = await axios.get<{
          message: string;
          threads?: Thread;
        }>("http://localhost:8080/thread/" + id, {});
      } catch (error) {
        return;
      }
      setThreadObject(threadResult.data.thread);
    };
    getThread();
  }, [id]);

  useEffect(() => {
    const getUser = async (): Promise<void> => {
      if (!threadObject) return;

      let userResult: AxiosResponse;
      try {
        userResult = await axios.get<{
          message: string;
          threads?: Thread[];
        }>("http://localhost:8080/user/" + threadObject.author, {});
      } catch (error) {
        console.log(error);
        return;
      }
      setuser(userResult.data.user);
    };

    const getComments = async (): Promise<void> => {
      let commentResult: AxiosResponse;
      if (!threadObject) return;

      try {
        commentResult = await axios.get<{
          message: string;
          comments?: Comment[];
        }>(
          "http://localhost:8080/thread/thread-comments/" +
            threadObject.threadId,
          {}
        );
      } catch (error) {
        console.log(error);
        return;
      }
      setComments(commentResult.data.comments);
    };
    getUser();
    getComments();
  }, [threadObject]);

  if (!(threadObject && user)) return <></>;

  const author = user.username;
  const path = "/profile/" + user.username;

  const list: JSX.Element[] = [];
  if (comments) {
    for (const comment of comments) {
      list.push(<ThreadComment root={comment} />);
    }
  }

  const likeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }

    if (!signedInUser) {
      setErrorMessage("You need to sign in to like");
      return;
    }

    if (signedInUser.likedThreads.includes(threadObject.threadId)) {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            likedThreads: prevUser.likedThreads.filter(
              (likedId) => likedId !== threadObject.threadId
            ),
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && { ...prevObject, likes: prevObject.likes - 1 }
      );
    } else {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            likedThreads: [...prevUser.likedThreads, threadObject.threadId],
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && {
            ...prevObject,
            likes: prevObject.likes + 1,
          }
      );
    }

    if (signedInUser.dislikedThreads.includes(threadObject.threadId)) {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            dislikedThreads: prevUser.dislikedThreads.filter(
              (dislikedId) => dislikedId !== threadObject.threadId
            ),
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && {
            ...prevObject,
            dislikes: prevObject.dislikes - 1,
          }
      );
    }

    setIsFetching(true);
    try {
      await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/like-thread/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
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
    setIsFetching(false);
  };

  const dislikeClickHandler = async (): Promise<void> => {
    if (isFetching || !threadObject) {
      return;
    }

    if (!signedInUser) {
      setErrorMessage("You need to sign in to dislike");
      return;
    }

    if (signedInUser.dislikedThreads.includes(threadObject.threadId)) {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            dislikedThreads: prevUser.dislikedThreads.filter(
              (dislikedId) => dislikedId !== threadObject.threadId
            ),
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && { ...prevObject, dislikes: prevObject.dislikes - 1 }
      );
    } else {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            dislikedThreads: [
              ...prevUser.dislikedThreads,
              threadObject.threadId,
            ],
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && {
            ...prevObject,
            dislikes: prevObject.dislikes + 1,
          }
      );
    }

    if (signedInUser.likedThreads.includes(threadObject.threadId)) {
      authContext.setSignedInUser(
        (prevUser) =>
          prevUser && {
            ...prevUser,
            likedThreads: prevUser.likedThreads.filter(
              (likedId) => likedId !== threadObject.threadId
            ),
          }
      );
      setThreadObject(
        (prevObject) =>
          prevObject && {
            ...prevObject,
            likes: prevObject.likes - 1,
          }
      );
    }

    setIsFetching(true);
    try {
      await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/dislike-thread/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
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

  const replyClickHandler = async (): Promise<void> => {
    navigate(`/create-comment/thread/${threadObject.threadId}`);
  };

  const title = threadObject.title;
  const context = threadObject.content;
  const userImage = user.profilePicture.imageUrl;
  const date = threadObject.date;

  const likeButtonClassName =
    signedInUser && signedInUser.likedThreads.includes(threadObject.threadId)
      ? "generalButton like-button--highlight"
      : "generalButton";

  const dislikeButtonClassName =
    signedInUser && signedInUser.dislikedThreads.includes(threadObject.threadId)
      ? "generalButton dislike-button--highlight"
      : "generalButton";

  return (
    <div className="wholePage">
      <ul>
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row">
              <img src={userImage} className="row__avatar" alt="Profile" />
              <div className="col row">
                <h3 className="thread-title col-12">{title}</h3>
                <p className="row__thread-title col-3">
                  <NavLink to={path} className="link">
                    {author}
                  </NavLink>
                </p>
                <p className="row__thread-title col-7">
                  {formatDate(new Date(date))}
                </p>
              </div>
            </div>
            <div className="category-box__thread-desc">{parse(context)}</div>
            <div>
              <button
                className={likeButtonClassName}
                onClick={likeClickHandler}
              >
                <FaThumbsUp />
                <p className="threadLikes">{threadObject.likes}</p>
              </button>
              <button
                className={dislikeButtonClassName}
                onClick={dislikeClickHandler}
              >
                <FaThumbsDown />
                <p className="threadLikes">{threadObject.dislikes}</p>
              </button>
              <button className="generalButton" onClick={replyClickHandler}>
                Reply
              </button>
            </div>
            <div>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </div>
          </div>
        </li>
        {list}
      </ul>
    </div>
  );
};

export default ThreadPage;

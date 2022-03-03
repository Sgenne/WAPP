import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useParams } from "react-router";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { Comment } from "../../../server/src/model/comment.interface";
import ThreadComment from "./ThreadComment";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import ErrorMessage from "./ErrorMessage";
import { formatDate } from "../utils/formatUtils";
import parse from "html-react-parser";

const ThreadPage = () => {
  const navigate = useNavigate();
  const param = useParams();
  const id = param.threadId;
  const [threads, setThreads] = useState<Thread>();
  const [user, setuser] = useState<User>();
  const [threadObject, setThreadObject] = useState<Thread>();
  const [comments, setComments] = useState<Comment[]>();
  const [errorMessage, setErrorMessage] = useState("");

  const authContext = useContext(AuthContext);

  async function getThread() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread;
      }>("http://localhost:8080/thread/" + id, {});
    } catch (error) {
      console.log(error);
      return;
    }
    setThreads(threadResult.data.thread);
  }

  async function getUser() {
    if (!threadObject) return;

    console.log("in getUser");

    try {
      userResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + threadObject.author, {});
    } catch (error) {
      console.log(error);
    }
    setuser(userResult.data.user);
  }

  async function getComments() {
    let commentResult: AxiosResponse;
    if (!threadObject) return;

    try {
      commentResult = await axios.get<{
        message: string;
        comments?: Comment[];
      }>(
        "http://localhost:8080/thread/threadComments/" + threadObject?.threadId,
        {}
      );
    } catch (error) {
      console.log(error);
      return;
    }
    setComments(commentResult.data.comments);
  }

  let threadResult: AxiosResponse;
  let userResult: AxiosResponse;

  useEffect(() => {
    getThread();
  }, []);

  useEffect(() => {
    if (threads) {
      setThreadObject(threads);
      getUser();
      getComments();
    }
  }, [threads, threadObject]);

  let author;

  if (!threadObject) return <div>No thread</div>;
  if (!user) return <div>An error has occured.</div>;

  author = user.username;
  const path = "/profile/" + user.username;

  const list: JSX.Element[] = [];
  if (comments) {
    for (const comment of comments) {
      list.push(<ThreadComment root={comment} />);
    }
  }

  const likeClickHandler = async () => {
    if (!authContext.signedInUser) return;

    let likeResult: AxiosResponse;
    try {
      likeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/likeThread/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
          username: authContext.signedInUser.username,
        }
      );
      setErrorMessage("");
      console.log(likeResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage(
          "Something went wrong while trying to like the thread."
        );
        return;
      }

      setErrorMessage(error.response.data.message);
      console.log(error);
      return;
    }
  };

  const dislikeClickHandler = async () => {
    if (!authContext.signedInUser) return;

    let dislikeResult: AxiosResponse;
    try {
      dislikeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/dislikeThread/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
          username: authContext.signedInUser.username,
        }
      );
      setErrorMessage("");
      console.log(dislikeResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage(
          "Something went wrong while trying to dislike the thread."
        );
        return;
      }

      setErrorMessage(error.response.data.message);
      console.log(error);
      return;
    }
  };

  const replyClickHandler = async () => {
    navigate(`/create-comment/thread/${threadObject.threadId}`);
  };

  const title = threadObject.title;
  const context = threadObject.content;
  const userImage = user.image.imageUrl;
  const likes = threadObject.likes;
  const dislikes = threadObject.dislikes;
  const date = threadObject.date;
  return (
    <div className="wholePage">
      <ul>
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row">
              <img src={userImage} className="row__avatar" />
              <div className="col row">
                <h3 className="thread-title col-12">{title}</h3>
                <p className="row__thread-title col-sm-3">
                  <NavLink to={path} className="link">
                    {author}
                  </NavLink>
                </p>
                <p className="row__thread-title col-sm-4">
                  {formatDate(new Date(date))}
                </p>
              </div>
            </div>
            <div className="category-box__thread-desc">{parse(context)}</div>
            <div>
              <button className="generalButton" onClick={likeClickHandler}>
                <FaThumbsUp />
                <p className="threadLikes">{likes}</p>
              </button>
              <button className="generalButton" onClick={dislikeClickHandler}>
                <FaThumbsDown />
                <p className="threadLikes">{dislikes}</p>
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

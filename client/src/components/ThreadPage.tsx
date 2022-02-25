import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useParams } from "react-router";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { Comment } from "../../../server/src/model/comment.interface";
import ThreadComment from "./ThreadComment";
import { AuthContext } from "../context/AuthContext";

const ThreadPage = () => {
  const param = useParams();
  const id = param.threadId;
  const [threads, setThreads] = useState<Thread>();
  const [user, setuser] = useState<User>();
  const [threadObject, setThreadObject] = useState<Thread>();
  const [comments, setComments] = useState<Comment[]>();

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

  const list: JSX.Element[] = [];
  if (comments) {
    for (const comment of comments) {
      list.push(<ThreadComment root={comment} />);
    }
  }

  const likeClickHandler = async () => {
    let likeResult: AxiosResponse;
    try {
      likeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/likeThread/",
        {
          userId: authContext.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
          username: authContext.userId,
        }
      );
      console.log(likeResult.data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const dislikeClickHandler = async () => {
    let dislikeResult: AxiosResponse;
    try {
      dislikeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/dislikeThread/",
        {
          userId: authContext.userId,
          password: authContext.password,
          threadId: threadObject.threadId,
          username: authContext.userId,
        }
      );

      console.log(dislikeResult.data);
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const title = threadObject.title;
  const context = threadObject.content;
  const discrod = user.image.imageUrl;
  const likes = threadObject.likes;
  const dislikes = threadObject.dislikes;
  const date = threadObject.date;
  return (
    <div className="wholePage">
      <ul>
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row">
              <img src={discrod} className="row__avatar" />
              <div className="col row">
                <h3 className="thread-title col-12">{title}</h3>
                <p className="row__thread-title col-3">
                  <a href="/profile" className="link">
                    {author}
                  </a>
                </p>
                <p className="row__thread-title col-4">
                  {new Date(date).toLocaleDateString() +
                    " " +
                    new Date(date).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="category-box__thread-desc">
              <p>{context}</p>
            </div>
            <div className="row">
              <button className="col-2" onClick={likeClickHandler}>
                <FaThumbsUp />
                <p className="threadLikes">{likes}</p>
              </button>
              <button className="col-2" onClick={dislikeClickHandler}>
                <FaThumbsDown />
                <p className="threadLikes">{dislikes}</p>
              </button>
              <button className="col-2">Reply</button>
            </div>
          </div>
        </li>
        {list}
      </ul>
    </div>
  );
};

export default ThreadPage;

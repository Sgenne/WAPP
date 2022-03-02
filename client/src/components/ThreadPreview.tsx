import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { AuthContext } from "../context/AuthContext";

const ThreadPreview = (props: { thread: Thread }) => {
  const [user, setThreads] = useState<User>();

  async function getUser() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + props.thread.author, {});
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.user);
  }

  let threadResult: AxiosResponse;
  let discrod;

  useEffect(() => {
    getUser();
  }, []);
  let author;
  if (user) {
    author = user?.username;
    discrod = user.image.imageUrl;
  }
  const authContext = useContext(AuthContext);

  const title: string = props.thread.title;
  const context: string = props.thread.content;
  const likes: number = props.thread.likes;
  const dislikes: number = props.thread.dislikes;
  const id: string = "/thread/" + props.thread.threadId;
  const date = props.thread.date;

  const likeClickHandler = async () => {
    let likeResult: AxiosResponse;
    try {
      likeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/likeThread/",
        {
          userId: authContext.userId,
          password: authContext.password,
          threadId: props.thread.threadId,
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
          threadId: props.thread.threadId,
          username: authContext.userId,
        }
      );

      console.log(dislikeResult.data);
    } catch (error) {
      console.log(error);
      return;
    }
  };
  return (
    <li>
      <div className="category-thread container-fluid px-4">
        <div className="row">
          <img src={discrod} className="row__avatar" />
          <div className="col row">
            <h3 className="thread-title col-12">
              <a href={id} className="link">
                {title}
              </a>
            </h3>
            <p className="row__thread-title col-3">
              <NavLink to={`/profile/${author}`} className="link">
                {author}
              </NavLink>
            </p>
            <p className="row__thread-title col-4">
              {new Date(date).toLocaleDateString() +
                " " +
                new Date(date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="category-box__thread-desc">
          <p className="threadPrevCont">{context}</p>
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
        </div>
      </div>
    </li>
  );
};

export default ThreadPreview;

import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import ReactQuill from "react-quill";
import { NavLink } from "react-router-dom";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "../utils/formatUtils";
import ErrorMessage from "./ErrorMessage";

const ThreadPreview = (props: { thread: Thread }) => {
  const [user, setThreads] = useState<User>();
  const [errorMessage, setErrorMessage] = useState("");

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
  let userImage;

  useEffect(() => {
    getUser();
  }, []);
  let author;
  if (user) {
    author = user?.username;
    userImage = user.image.imageUrl;
  }
  const authContext = useContext(AuthContext);

  const title: string = props.thread.title;
  const context: string = props.thread.content;
  const likes: number = props.thread.likes;
  const dislikes: number = props.thread.dislikes;
  const id: string = "/thread/" + props.thread.threadId;
  const date = props.thread.date;

  const likeClickHandler = async () => {
    if (!authContext.signedInUser) return;

    let likeResult: AxiosResponse;
    try {
      likeResult = await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/likeThread/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          threadId: props.thread.threadId,
          username: authContext.signedInUser.username,
        }
      );
      setErrorMessage("");
      console.log(likeResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong while signing in.");
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
          threadId: props.thread.threadId,
          username: authContext.signedInUser.userId,
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
          <img src={userImage} className="row__avatar" />
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
            <p className="row__thread-title col-4">
              {formatDate(new Date(date))}
            </p>
          </div>
        </div>
        <div className="category-box__thread-desc">
          <ReactQuill readOnly value={context} />
          {/* <p className="threadPrevCont">{context}</p> */}
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
        <div>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
      </div>
    </li>
  );
};

export default ThreadPreview;

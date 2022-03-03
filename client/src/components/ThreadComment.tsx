import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { Comment } from "../../../server/src/model/comment.interface";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { AuthContext } from "../context/AuthContext";
import { formatDate } from "../utils/formatUtils";
import ErrorMessage from "./ErrorMessage";

const ThreadComment = (props: { root: Comment }) => {
  const [user, setThreads] = useState<User>();
  const [comments, setComments] = useState<Comment[]>();
  const authContext = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");

  async function getComments() {
    let commentResult: AxiosResponse;

    try {
      commentResult = await axios.get<{
        message: string;
        comments?: Comment[];
      }>(
        "http://localhost:8080/thread/commentComments/" + props.root.commentId,
        {}
      );
    } catch (error) {
      console.log(error);
      return;
    }
    setComments(commentResult.data.comments);
  }

  async function getUser() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + props.root.author, {});
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.user);
  }

  let threadResult: AxiosResponse;

  useEffect(() => {
    getUser();
    getComments();
  }, []);
  let author;
  if (user) {
    author = user?.username;
  }

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
        "http://localhost:8080/comment/likeComment/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          commentID: props.root.commentId,
          username: authContext.signedInUser.username,
        }
      );
      setErrorMessage("");
      console.log(likeResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong when liking.");
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
        "http://localhost:8080/comment/dislikeComment/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          commentID: props.root.commentId,
          username: authContext.signedInUser.username,
        }
      );
      setErrorMessage("");

      console.log(dislikeResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Something went wrong when disliking.");
        return;
      }

      setErrorMessage(error.response.data.message);
      console.log(error);
      return;
    }
  };

  const navigate = useNavigate();
  const replyClickHandler = async () => {
    navigate(`/create-comment/comment/${props.root.commentId}`);
  };

  const context: string = props.root.content;
  const likes = props.root.likes;
  const dislikes = props.root.dislikes;
  const date = props.root.date;
  const path = "/profile/" + user?.username;

  return (
    <li style={{ marginLeft: "30px" }}>
      <div className="category-box container-fluid px-4">
        <div className="row">
          <p className="category-box__row__thread-title col-3">
            <NavLink to={path} className="link">
              {author}
            </NavLink>
          </p>
          <p className="category-box__row__thread-title col-3">
            {formatDate(new Date(date))}
          </p>
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
          <button className="col-2" onClick={replyClickHandler}>
            Reply
          </button>
        </div>
        <div>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
      </div>
      <ul>{list}</ul>
    </li>
  );
};

export default ThreadComment;

import axios, { AxiosResponse } from "axios";
import { useState, useEffect, useContext } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { Comment } from "../../../../server/src/model/comment.interface";
import { Thread } from "../../../../server/src/model/thread.interface";
import { User } from "../../../../server/src/model/user.interface";
import { AuthContext } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatUtils";
import ErrorMessage from "../common/ErrorMessage";
import parse from "html-react-parser";

const ThreadComment = (props: { root: Comment }): JSX.Element => {
  const [user, setThreads] = useState<User>();
  const [comments, setComments] = useState<Comment[]>();
  const authContext = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [likes, setLikes] = useState(props.root.likes);
  const [dislikes, setDislikes] = useState(props.root.dislikes);

  async function getComments(): Promise<void> {
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

  async function getUser(): Promise<void> {
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

  useEffect((): void => {
    getUser();
    getComments();
    setLikes(props.root.likes);
    setDislikes(props.root.dislikes);
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

  const likeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }
    if (!authContext.signedInUser) {
      setErrorMessage("You need to sign in to like");
      return;
    }

    let likeResult: AxiosResponse;
    setIsFetching(true);
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
      setLikes(likeResult.data.comment.likes);
      setDislikes(likeResult.data.comment.dislikes);
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
    setIsFetching(false);
  };

  const dislikeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }
    if (!authContext.signedInUser) {
      setErrorMessage("You need to sign in to dislike");
      return;
    }
    let dislikeResult: AxiosResponse;
    setIsFetching(true);
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
      setLikes(dislikeResult.data.comment.likes);
      setDislikes(dislikeResult.data.comment.dislikes);
      console.log(dislikeResult.data);
    } catch (error) {
      setIsFetching(false);
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

  const navigate = useNavigate();
  const replyClickHandler = async (): Promise<void> => {
    navigate(`/create-comment/comment/${props.root.commentId}`);
  };

  const context: string = props.root.content;
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
          <p className="category-box__row__thread-title col-5">
            {formatDate(new Date(date))}
          </p>
        </div>
        <div className="category-box__thread-desc">
          <p>{parse(context)}</p>
        </div>
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
      <ul>{list}</ul>
    </li>
  );
};

export default ThreadComment;

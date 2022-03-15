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
import LoggedInButtonsComment from "../common/LoggedInButtonsComment";

const ThreadComment = (props: { root: Comment }): JSX.Element => {
  const [user, setUser] = useState<User>();
  const [comments, setComments] = useState<Comment[]>();
  const [comment, setComment] = useState<Comment>();
  const [errorMessage, setErrorMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [likes, setLikes] = useState(props.root.likes);
  const [dislikes, setDislikes] = useState(props.root.dislikes);

  const authContext = useContext(AuthContext);
  const signedInUser = authContext.signedInUser;
  const navigate = useNavigate();

  useEffect((): void => {
    const getComment = async (): Promise<void> => {
      let commentResult: AxiosResponse;
      try {
        commentResult = await axios.get<{
          message: string;
          threads?: Thread[];
        }>("http://localhost:8080/comment/" + props.root.commentId, {});
      } catch (error) {
        console.log(error);
        return;
      }
      
      setComment(commentResult.data.comment);
    };

    const getUser = async (): Promise<void> => {
      let userResult: AxiosResponse;
      try {
        userResult = await axios.get<{
          message: string;
          user?: User;
        }>("http://localhost:8080/user/" + props.root.author, {});
      } catch (error) {
        console.log(error);
        return;
      }
      setUser(userResult.data.user);
    };

    async function getComments(): Promise<void> {
      let commentResult: AxiosResponse;

      try {
        commentResult = await axios.get<{
          message: string;
          comments?: Comment[];
        }>(
          "http://localhost:8080/comment/comment-comments/" +
            props.root.commentId,
          {}
        );
      } catch (error) {
        console.log(error);
        return;
      }
      setComments(commentResult.data.comments);
    }

    getUser();
    getComments();
    getComment();
  }, [props.root.author, props.root.commentId]);

  if (!user) return <></>;

  const likeClickHandler = async (): Promise<void> => {
    if (isFetching) {
      return;
    }
    if (!signedInUser) {
      setErrorMessage("You need to sign in to like");
      return;
    }

    if (signedInUser.likedComments.includes(props.root.commentId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedComments: prevUser.likedComments.filter(
            (likedId) => likedId !== props.root.commentId
          ),
        };
      });
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedComments: [...prevUser.likedComments, props.root.commentId],
        };
      });
      setLikes((prevLikes) => prevLikes + 1);
    }

    if (signedInUser.dislikedComments.includes(props.root.commentId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedComments: prevUser.dislikedComments.filter(
            (dislikedId) => dislikedId !== props.root.commentId
          ),
        };
      });

      setDislikes((prevDislikes) => prevDislikes - 1);
    }
    setIsFetching(true);
    try {
      await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/comment/like-comment/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          commentID: props.root.commentId,
          username: signedInUser.username,
        }
      );
      setErrorMessage("");
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

    if (!signedInUser) {
      setErrorMessage("You need to sign in to dislike");
      return;
    }

    if (signedInUser.dislikedComments.includes(props.root.commentId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedComments: prevUser.dislikedComments.filter(
            (dislikedId) => dislikedId !== props.root.commentId
          ),
        };
      });
      setDislikes((prevDislikes) => prevDislikes - 1);
    } else {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          dislikedComments: [
            ...prevUser.dislikedComments,
            props.root.commentId,
          ],
        };
      });
      setDislikes((prevDislikes) => prevDislikes + 1);
    }

    if (signedInUser.likedComments.includes(props.root.commentId)) {
      authContext.setSignedInUser((prevUser) => {
        if (!prevUser) return;

        return {
          ...prevUser,
          likedComments: prevUser.likedComments.filter(
            (likedId) => likedId !== props.root.commentId
          ),
        };
      });

      setLikes((prevLikes) => prevLikes - 1);
    }

    setIsFetching(true);
    try {
      await axios.put<{ message: string; thread?: Thread }>(
        "http://localhost:8080/comment/dislike-comment/",
        {
          userId: signedInUser.userId,
          password: authContext.password,
          commentID: props.root.commentId,
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
    navigate(`/create-comment/comment/${props.root.commentId}`);
  };

  const content: string = props.root.content;
  const date = props.root.date;
  const path = "/profile/" + user.username;

  const likeButtonClassName =
    signedInUser && signedInUser.likedComments.includes(props.root.commentId)
      ? "generalButton like-button--highlight"
      : "generalButton";

  const dislikeButtonClassName =
    signedInUser && signedInUser.dislikedComments.includes(props.root.commentId)
      ? "generalButton dislike-button--highlight"
      : "generalButton";

  const displayedChildComments: JSX.Element[] = comments
    ? comments.map((comment) => (
        <ThreadComment root={comment} key={comment.commentId} />
      ))
    : [];

  return (
    <li style={{ marginLeft: "30px" }}>
      <div className="category-box container-fluid px-4">
        <div className="row">
          <p className="category-box__row__thread-title col-3">
            <NavLink to={path} className="link">
              {user.username}
            </NavLink>
          </p>
          <p className="category-box__row__thread-title col-5">
            {formatDate(new Date(date))}
          </p>
        </div>
        <div className="category-box__thread-desc">{parse(content)}</div>
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
          <button className="generalButton" onClick={replyClickHandler}>
            Reply
          </button>
          <LoggedInButtonsComment userId={authContext.signedInUser?.userId} comment={comment} />
        </div>
        <div>
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </div>
      </div>
      <ul>{displayedChildComments}</ul>
    </li>
  );
};

export default ThreadComment;

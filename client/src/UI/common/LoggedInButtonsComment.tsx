import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Comment } from "../../../../server/src/model/comment.interface";
import { AuthContext } from "../../context/AuthContext";

const LoggedInButtonsComment = (props: {
  userId: number | undefined;
  comment: Comment | undefined;
}): JSX.Element => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (!props.comment || props.comment?.author !== props.userId) {
    return <div className="hide"></div>;
  }

  const deleteComment = async (): Promise<void> => {
    if (!authContext.signedInUser) return;
    const data = {
      userId: authContext.signedInUser.userId,
      password: authContext.password,
      commentID: props.comment?.commentId,
    };
    try {
      await axios.delete("http://localhost:8080/comment/delete-comment", {
        data,
      });
    } catch (error) {
      console.log(error);
      return;
    }
    navigate("/");
  };

  const editComment = async (): Promise<void> => {
    if (!authContext.signedInUser) return;
    navigate("/create-comment/editcomment/" + props.comment?.commentId);
  };

  return (
    <>
      <button className="generalButton button" onClick={deleteComment}>
        Delete comment
      </button>
      <button className="generalButton button" onClick={editComment}>
        Edit comment
      </button>
    </>
  );
};

export default LoggedInButtonsComment;

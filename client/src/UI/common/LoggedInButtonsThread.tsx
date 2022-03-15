import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { AuthContext } from "../../context/AuthContext";

const LoggedInButtonsThread = (props: {
  userId: number | undefined;
  thread: Thread;
}): JSX.Element => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  if (props.thread.author !== props.userId) {
    return <div className="hide"></div>;
  }

  const deleteThread = async (): Promise<void> => {
    if (!authContext.signedInUser) return;
    const data = {
      userId: authContext.signedInUser.userId,
      password: authContext.password,
      threadId: props.thread.threadId,
    };
    try {
      await axios.delete("http://localhost:8080/thread/delete-thread", {
        data,
      });
    } catch (error) {
      console.log(error);
      return;
    }
    navigate("/");
  };

  const editThread = async (): Promise<void> => {
    if (!authContext.signedInUser) return;
    navigate("/create-thread/" + props.thread.threadId);
  };

  return (
    <>
      <button className="generalButton button" onClick={deleteThread}>
        Delete thread
      </button>
      <button className="generalButton button" onClick={editThread}>
        Edit thread
      </button>
    </>
  );
};

export default LoggedInButtonsThread;

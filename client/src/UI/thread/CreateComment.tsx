import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { Comment } from "../../../../server/src/model/comment.interface";
import { AuthContext } from "../../context/AuthContext";
import QuillTools, { formats, modules } from "../../utils/quillTools";
import ErrorMessage from "../common/ErrorMessage";
import parse from "html-react-parser";

const CreateComment = (): JSX.Element => {
  const [value, setValue] = useState("");
  const [comment, setComment] = useState<Comment>();

  const [errorMessage, setErrorMessage] = useState("");
  const [commentFor, setCommentFor] = useState<Thread>();

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const params = useParams();
  const category = params.category;
  useEffect((): void => {
    const getComment = async (): Promise<void> => {
      if (params.type === "thread") {
        let result: AxiosResponse;
        try {
          result = await axios.get<{
            message: string;
            thread?: Thread;
          }>("http://localhost:8080/thread/" + params.id, {});
        } catch (error) {
          return;
        }
        setCommentFor(result.data.thread);
      }
    };

    const getCommentDeta = async (): Promise<void> => {
      if (params.type === "editcomment") {
        let result: AxiosResponse;
        try {
          result = await axios.get<{
            message: string;
            comment: Comment;
          }>("http://localhost:8080/comment/" + params.id, {});
        } catch (error) {
          return;
        }
        setComment(result.data.comment);
        result.data.comment.content.includes("last edited")
          ? setValue(
              result.data.comment.content.substring(
                0,
                result.data.comment.content.length - 22
              )
            )
          : setValue(result.data.comment.content);
      }
    };

    getComment();
    getCommentDeta();
  }, [params.id, params.type]);

  const submitClickHandler = async () => {
    if (!authContext.signedInUser) {
      setErrorMessage("You need to sign in to comment");
      return;
    }
    
    let resultData: AxiosResponse;
    try {
      if (!comment || params.type !== "editcomment") {
        resultData = await axios.post<{ message: string; comment?: Comment }>(
          "http://localhost:8080/" + params.type + "/reply/",
          {
            userId: authContext.signedInUser?.userId,
            password: authContext.password,
            title: category,
            threadId: params.id,
            commentID: params.id,
            content: value,
          }
        );
      } else{
        console.log(value)
        resultData = await axios.put<{ message: string; comment?: Comment }>(
          "http://localhost:8080/comment/edit-comment/",
          {
            userId: authContext.signedInUser?.userId,
            password: authContext.password,
            commentID: params.id,
            content: value,
          }
        );
      }

      if (params.type === "thread") {
        navigate("/thread/" + params.id);
      } else {
        navigate("/thread/" + resultData.data.comment.rootThread);
      }
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Could not create comment");
        return;
      }

      setErrorMessage(error.response.data.message);
      return;
    }
  };

  return (
    <div className="wholePage">
      <ul className="category-list">
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row1">
              <h3 className="thread-title">
                You are about to create a comment for {params.type}{" "}
                {(params.type === "thread" && commentFor?.title) || params.id}
              </h3>
            </div>
            <div className="thread-desc">
              {commentFor && parse(commentFor?.content)}
            </div>
          </div>
        </li>
        <li>
          <div id="postthread">
            <QuillTools />
            <ReactQuill
              value={value}
              onChange={setValue}
              modules={modules}
              formats={formats}
            />

            <div id="submitbut">
              <button
                className="button button--grey"
                id="subThread"
                onClick={submitClickHandler}
              >
                Create comment
              </button>
            </div>
            <div>
              <ErrorMessage>{errorMessage}</ErrorMessage>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CreateComment;

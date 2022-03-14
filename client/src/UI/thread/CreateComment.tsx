import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { AuthContext } from "../../context/AuthContext";
import QuillTools, { formats, modules } from "../../utils/quillTools";
import ErrorMessage from "../common/ErrorMessage";
import parse from "html-react-parser";

const CreateComment = (): JSX.Element => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [commentFor, setCommentFor] = useState<Thread>();

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const params = useParams();
  const category = params.category;

  useEffect((): void => {
    const getComment = async (): Promise<void> => {
      let result: AxiosResponse;
      if (params.type === "thread") {
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
    getComment();
  }, [params.id, params.type]);

  const submitClickHandler = async () => {
    if (!authContext.signedInUser) {
      setErrorMessage("You need to sign in to comment");
      return;
    }

    let signInResult: AxiosResponse;
    try {
      signInResult = await axios.post<{ message: string; thread?: Thread }>(
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

      if (params.type === "thread") {
        navigate("/thread/" + params.id);
      } else {
        navigate("/thread/" + signInResult.data.comment.rootThread);
      }
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Could not create comment");
        return;
      }

      setErrorMessage(error.response.data.message);
      console.log(error);
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

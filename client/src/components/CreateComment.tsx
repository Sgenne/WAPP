import axios, { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { Thread } from "../../../server/src/model/thread.interface";
import { AuthContext } from "../context/AuthContext";
import ErrorMessage from "./ErrorMessage";

const CreateComment = () => {
  const authContext = useContext(AuthContext);
  const params = useParams();
  const category = params.category;
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (params.type != "thread" && params.type != "comment") {
    return <div>Invald type</div>;
  }

  const submitClickHandler = async () => {
    let signInResult: AxiosResponse;
    try {
      signInResult = await axios.post<{ message: string; thread?: Thread }>(
        "http://localhost:8080/" + params.type + "/reply/",
        {
          userId: authContext.signedInUser?.userId,
          password: authContext.password,
          categoryId: category,
          threadId: params.id,
          commentID: params.id,
          content: value,
        }
      );

      console.log(signInResult.data);
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
                You are about to create a comment for {params.type} {params.id}
              </h3>
            </div>
            <div className="thread-desc">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                malesuada odio at magna faucibus, eget mollis erat tempor.
              </p>
            </div>
          </div>
        </li>
        <li>
          <div id="postthread">
            <ReactQuill value={value} onChange={setValue} />

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

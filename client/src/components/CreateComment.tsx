import axios, { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { Thread } from "../../../server/src/model/thread.interface";
import { AuthContext } from "../context/AuthContext";

const CreateComment = () => {
  const authContext = useContext(AuthContext);
  const params = useParams();
  const category = params.category;
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const createThreadChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue2(event.target.value);
  };
  if (params.type != "thread" && params.type != "comment") {
    return <div>Invald type</div>;
  }

  const submitClickHandler = async () => {
    let signInResult: AxiosResponse;
    try {
      signInResult = await axios.post<{ message: string; thread?: Thread }>(
        "http://localhost:8080/" + params.type + "/reply/",
        {
          userId: authContext.userId,
          password: authContext.password,
          categoryId: category,
          id: params.id,
          content: value,
        }
      );

      console.log(signInResult.data);
    } catch (error) {
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
                You are about to create a thread under category {category}
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
            <ReactQuill
              id="quill"
              theme="snow"
              value={value}
              onChange={setValue}
            />

            <div id="submitbut">
              <button
                className="button button--grey"
                id="subThread"
                onClick={submitClickHandler}
              >
                Submit Thread
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CreateComment;
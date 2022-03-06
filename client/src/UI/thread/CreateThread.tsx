import axios, { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { AuthContext } from "../../context/AuthContext";
import ErrorMessage from "../common/ErrorMessage";
import QuillTools, { modules, formats } from "../../utils/quillTools";


const CreateThread = (): JSX.Element => {
  const params = useParams();
  const category = params.category;
  const [value, setValue] = useState("");
  const [value2, setValue2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const createThreadChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValue2(event.target.value);
  };
  const authContext = useContext(AuthContext);

  const submitClickHandler = async (): Promise<void> => {
    if (!authContext.signedInUser) if (!authContext.signedInUser){
      setErrorMessage("You need to sign in to create a thread");
      return;
    } 

    let signInResult: AxiosResponse;
    try {
      signInResult = await axios.post<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/postThread/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          categoryId: category,
          title: value2,
          content: value,
        }
      );
      setErrorMessage("");
      console.log(signInResult.data);
    } catch (error) {
      if (!(axios.isAxiosError(error) && error.response)) {
        setErrorMessage("Could not create thread");
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
                You are about to create a thread under category {category}
              </h3>
            </div>
            <div className="thread-desc">
              <p>Edit in the future</p>
            </div>
          </div>
        </li>
        <li>
          <div id="postthread">
            <input
              maxLength={54}
              id="threadinput"
              placeholder="Thread title"
              onChange={createThreadChangeHandler}
            />
            <QuillTools />
            <ReactQuill value={value} onChange={setValue} modules={modules} formats={formats}/>

            <div id="submitbut">
              <button
                className="button button--grey"
                id="subThread"
                onClick={submitClickHandler}
              >
                Submit Thread
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

export default CreateThread;
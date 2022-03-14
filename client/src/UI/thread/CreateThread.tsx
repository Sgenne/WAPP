import axios, { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { Thread } from "../../../../server/src/model/thread.interface";
import { AuthContext } from "../../context/AuthContext";
import ErrorMessage from "../common/ErrorMessage";
import QuillTools, { modules, formats } from "../../utils/quillTools";
import { Category } from "../../../../server/src/model/category.interface";

const CreateThread = (): JSX.Element => {
  const [contentInput, setContentInput] = useState("");
  const [titleInput, setTitleInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState<Category>();
  const [thread, setThread] = useState<Thread>();

  const navigate = useNavigate();
  const param = useParams();
  const authContext = useContext(AuthContext);

  let variable = param.category;

  const threadTitleChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitleInput(event.target.value);
  };

  useEffect(() => {
    const getCategoryDetails = async (): Promise<void> => {
      let categoryResult: AxiosResponse;
      try {
        categoryResult = await axios.get<{
          message: string;
          category?: Category;
        }>("http://localhost:8080/thread/category-details/" + variable, {});
      } catch (error) {
        console.log(error);
        return;
      }
      setCategory(categoryResult.data.category);
    };

    const getThreadDetails = async (): Promise<void> => {
      let ThreadResult: AxiosResponse;
      try {
        ThreadResult = await axios.get<{
          message: string;
          thread: Thread;
        }>("http://localhost:8080/thread/" + variable, {});
      } catch (error) {
        console.log(error);
        return;
      }
      setThread(ThreadResult.data.thread);
      variable = ThreadResult.data.thread.category;
      getCategoryDetails();
      ThreadResult.data.thread.content.includes("last edited")
        ? setContentInput(
            ThreadResult.data.thread.content.substring(
              0,
              ThreadResult.data.thread.content.length - 22
            )
          )
        : setContentInput(ThreadResult.data.thread.content);
      setTitleInput(ThreadResult.data.thread.title);
    };

    if (variable && !isNaN(+variable) && authContext.isSignedIn) {
      getThreadDetails();
    } else {
      getCategoryDetails();
    }
  }, [variable]);

  if (!category) return <></>;

  const submitClickHandler = async (): Promise<void> => {
    if (!authContext.signedInUser) {
      setErrorMessage("You need to sign in to create a thread");
      return;
    }

    let threadPostResult: AxiosResponse;
    if (thread) {
      try {
        threadPostResult = await axios.put<{
          message: string;
          thread?: Thread;
        }>("http://localhost:8080/thread/edit-thread/", {
          threadId: thread.threadId,
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          title: titleInput,
          content: contentInput,
        });
        setErrorMessage("");
        navigate("/thread/" + threadPostResult.data.thread.threadId);
      } catch (error) {
        if (!(axios.isAxiosError(error) && error.response)) {
          setErrorMessage("Could not edit thread");
          return;
        }

        setErrorMessage(error.response.data.message);
        console.log(error);
        return;
      }
      return;
    }
    try {
      threadPostResult = await axios.post<{ message: string; thread?: Thread }>(
        "http://localhost:8080/thread/post-thread/",
        {
          userId: authContext.signedInUser.userId,
          password: authContext.password,
          categoryTitle: category.title,
          title: titleInput,
          content: contentInput,
        }
      );
      setErrorMessage("");
      navigate("/thread/" + threadPostResult.data.thread.threadId);
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
                You are about to create a thread under category {category.title}
              </h3>
            </div>
            <div className="thread-desc">{category.description}</div>
          </div>
        </li>
        <li>
          <div id="postthread">
            <input
              maxLength={54}
              id="threadinput"
              placeholder="Thread title"
              value={titleInput}
              onChange={threadTitleChangeHandler}
            />
            <QuillTools />
            <ReactQuill
              value={contentInput}
              onChange={setContentInput}
              modules={modules}
              formats={formats}
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

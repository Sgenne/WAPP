import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Thread } from "../../../server/src/model/thread.interface";
import ThreadPreview from "./ThreadPreview";

const CategoryPage = () => {
  const param = useParams();
  const category = param.category;
  const [threads, setThreads] = useState<Thread[]>([]);

  // async function getCat() {
  //   try {
  //     threadResult = await axios.get<{
  //       message: string;
  //       threads?: Thread[];
  //     }>("http://localhost:8080/thread/categoryThreads/" + category, {});
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setThreads(threadResult.data.threads);
  // }

  let threadResult: AxiosResponse;

  // useEffect(() => {
  //   getCat();
  // }, []);
  let ThreadPreviewContent;
  if (threads) {
    ThreadPreviewContent = threads.map((thr: Thread) => (
      <span key={thr.threadId}>
        <ThreadPreview thread={thr} />
      </span>
    ));
  }

  const navigate = useNavigate();
  const submitClickHandler = async () => {
    navigate(`/create-thread/${category}`);
  };
  return (
    <div className="wholePage">
      <ul>
        <li className="row">
          <div className="col-sm-5"></div>
          <div className="col-sm-2">
            <h1 id="catigory-title">{category}</h1>
          </div>
          <div className="col-sm-3"></div>
          <div className="col-sm-2">
            <button
              className="button button--grey newThreadButton"
              onClick={submitClickHandler}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="48"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
              >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
              </svg>
              <div className="threadButtonSpan">Thread</div>
            </button>
          </div>
        </li>
        {ThreadPreviewContent}
      </ul>
    </div>
  );
};

export default CategoryPage;

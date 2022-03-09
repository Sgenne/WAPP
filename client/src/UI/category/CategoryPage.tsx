import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Category } from "../../../../server/src/model/category.interface";
import { Thread } from "../../../../server/src/model/thread.interface";
import ThreadPreview from "../thread/ThreadPreview";

const CategoryPage = (): JSX.Element => {
  const param = useParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [category, setCategory] = useState<Category>();

  async function getCategoryThreads(): Promise<void> {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/thread/categoryThreads/" + param.category, {});
    } catch (error) {
      return;
    }
    setThreads(threadResult.data.threads);
  }

  async function getCategoryDetails(): Promise<void> {
    try {
      categoryResult = await axios.get<{
        message: string;
        category?: Category;
      }>("http://localhost:8080/thread/categoryDetails/" + param.category, {});
    } catch (error) {
      return;
    }
    setCategory(categoryResult.data.category);
  }

  let threadResult: AxiosResponse;
  let categoryResult: AxiosResponse;

  useEffect(() => {
    getCategoryDetails();
    getCategoryThreads();
  }, []);

  const navigate = useNavigate();
  const submitClickHandler = async () => {
    navigate(`/create-thread/${category?.title}`);
  };
  
  let ThreadPreviewContent;
  if (threads) {
    ThreadPreviewContent = threads.map((thr: Thread) => (
      <span key={thr.threadId}>
        <ThreadPreview thread={thr} />
      </span>
    ));
  }
  return (

    <div className="wholePage">
      <ul>
        <li className="flex">
          <div className="category-title">
          <h1 >{category?.title}</h1>
          <p>{category?.description}</p>
          </div>
          <div>
            <button
              className="button newThreadButton"
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

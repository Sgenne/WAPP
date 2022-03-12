import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import ThreadPreview from "../thread/ThreadPreview";
import { FaArrowDown } from "react-icons/fa";
import { Category } from "../../../../server/src/model/category.interface";
import axios, { AxiosResponse } from "axios";
import { Thread } from "../../../../server/src/model/thread.interface";
import { NavLink } from "react-router-dom";

const CategoryPreview = (props: { category: Category }): JSX.Element => {
  const [threads, setThreads] = useState<Thread[]>([]);

  async function getThreads(): Promise<void> {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>(
        "http://localhost:8080/thread/sampleThreads/" + props.category.title,
        {}
      );
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.threads);
  }

  let threadResult: AxiosResponse;

  useEffect((): void => {
    getThreads();
  }, []);
  let ThreadPreviewContent;
  if (threads) {
    ThreadPreviewContent = threads.map((thr: Thread) => (
      <span key={thr.threadId}>
        <ThreadPreview thread={thr} />
      </span>
    ));
  }

  const [open, setOpen] = useState(false);
  const link = `/category/${props.category.title}`;

  return (
    <li className="category-box container-fluid px-4">
      <div className="flex">
        <h2>
          <NavLink to={link} className="fullHeight">
            {props.category.title.replaceAll("-", " ")}
          </NavLink>
        </h2>

        <button
          onClick={() => setOpen((prevValue) => !prevValue)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          className="generalButton mostRight"
        >
          <FaArrowDown />
        </button>
      </div>
      <Collapse in={open} timeout={0}>
        <div className="row mt-2 collapse" id="collapseCat">
          <p className="col-12 col-lg-3">{props.category.description}</p>
          <ul className="category-box__threads col-12 col-lg-9">
            {ThreadPreviewContent}
          </ul>
        </div>
      </Collapse>
    </li>
  );
};

export default CategoryPreview;

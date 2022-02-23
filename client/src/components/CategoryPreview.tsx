import { useEffect, useState } from "react";
import { Button, Collapse } from "react-bootstrap";
import ThreadPreview from "./ThreadPreview";
import { FaArrowDown } from "react-icons/fa";
import { Category } from "../../../server/src/model/category.interface";
import axios, { AxiosResponse } from "axios";
import { Thread } from "../../../server/src/model/thread.interface";

const CategoryPreview = (props: { category: Category }) => {
  const [threads, setThreads] = useState<Thread[]>([]);

  async function getCat() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>(
        "http://localhost:8080/thread/sampleThreads/" +
          props.category.CategoryId,
        {}
      );
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.threads);
  }

  let threadResult: AxiosResponse;

  useEffect(() => {
    getCat();
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
  const link = `/category/${props.category.CategoryId}`;
  return (
    <li className="category-box container-fluid px-4">
      <div className="row">
        <h3 className="col-11">
          <a href={link}> {props.category.title} </a>
        </h3>

        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          className="button button--grey col-1"
        >
          <FaArrowDown />
        </Button>
      </div>
      <Collapse in={open}>
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

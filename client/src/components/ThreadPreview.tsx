import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";

const ThreadPreview = (props: { thread: Thread }) => {
  const [user, setThreads] = useState<User>();

  async function getUser() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + props.thread.author, {});
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.user);
  }

  let threadResult: AxiosResponse;

  useEffect(() => {
    getUser();
  }, []);
  let author;
  if (user) {
    author = user?.username;
  }

  const title: string = props.thread.title;
  const context: string = props.thread.content;
  const discrod = require("./../resources/img/discrod.png");
  const likes: number = props.thread.likes;
  const dislikes: number = props.thread.dislikes;
  const id: string = "/thread/" + props.thread.threadId;
  return (
    <li>
      <div className="category-thread container-fluid px-4">
        <div className="row">
          <img src={discrod} className="row__avatar" />
          <div className="col row">
            <h3 className="thread-title col-12">
              <a href={id} className="link">
                {title}
              </a>
            </h3>
            <p className="row__thread-title col-3">
              <a href="thread.html" className="link">
                {author}
              </a>
            </p>
            <p className="row__thread-title col-3">
              <a href="thread.html" className="link">
                /*TODO Date*
              </a>
            </p>
          </div>
        </div>
        <div className="category-box__thread-desc">
          <p className="threadPrevCont">{context}</p>
        </div>
        <div className="row">
          <div className="col-2">
            <FaThumbsUp />
            <p className="threadLikes">{likes}</p>
          </div>
          <div className="col-2">
            <FaThumbsDown />
            <p className="threadLikes">{dislikes}</p>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ThreadPreview;

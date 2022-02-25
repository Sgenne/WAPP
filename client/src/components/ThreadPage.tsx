import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useParams } from "react-router";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";
import { Comment } from "../../../server/src/model/comment.interface";
import ThreadComment from "./ThreadComment";

const ThreadPage = () => {
  const param = useParams();
  const id = param.threadId;
  const [threads, setThreads] = useState<Thread>();
  const [user, setuser] = useState<User>();
  const [threadObject, setThreadObject] = useState<Thread>();
  const [comments, setComments] = useState<Comment[]>();

  async function getThread() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread;
      }>("http://localhost:8080/thread/" + id, {});
    } catch (error) {
      console.log(error);
      return;
    }
    setThreads(threadResult.data.thread);
  }

  async function getUser() {
    if (!threadObject) return;

    console.log("in getUser");

    try {
      userResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + threadObject.author, {});
    } catch (error) {
      console.log(error);
    }
    setuser(userResult.data.user);
  }

  async function getComments() {
    let commentResult: AxiosResponse;
    if (!threadObject) return;

    try {
      commentResult = await axios.get<{
        message: string;
        comments?: Comment[];
      }>(
        "http://localhost:8080/thread/threadComments/" + threadObject?.threadId,
        {}
      );
    } catch (error) {
      console.log(error);
      return;
    }
    setComments(commentResult.data.comments);
  }

  let threadResult: AxiosResponse;
  let userResult: AxiosResponse;

  useEffect(() => {
    getThread();
  }, []);

  useEffect(() => {
    if (threads) {
      setThreadObject(threads);
      getUser();
      getComments();
    }
  }, [threads, threadObject]);

  let author;

  if (!threadObject) return <div>No thread</div>;
  if (!user) return <div>An error has occured.</div>;

  author = user.username;

  const list: JSX.Element[] = [];
  if (comments) {
    for (const comment of comments) {
      list.push(<ThreadComment root={comment} />);
    }
  }

  const title = threadObject.title;
  const context = threadObject.content;
  const discrod = user.image.imageUrl;
  const likes = threadObject.likes;
  const dislikes = threadObject.dislikes;
  return (
    <div className="wholePage">
      <ul>
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row">
              <img src={discrod} className="row__avatar" />
              <div className="col row">
                <h3 className="thread-title col-12">
                  <a href="thread.html" className="link">
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
              <p>{context}</p>
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
              <div className="col-2">Reply</div>
            </div>
          </div>
        </li>
        {list}
      </ul>
    </div>
  );
};

export default ThreadPage;

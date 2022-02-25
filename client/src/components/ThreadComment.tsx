import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";
import { Comment } from "../../../server/src/model/comment.interface";
import { Thread } from "../../../server/src/model/thread.interface";
import { User } from "../../../server/src/model/user.interface";

const ThreadComment = (props: { root: Comment }) => {
  const [user, setThreads] = useState<User>();
  const [comments, setComments] = useState<Comment[]>();

  async function getComments() {
    let commentResult: AxiosResponse;

    try {
      commentResult = await axios.get<{
        message: string;
        comments?: Comment[];
      }>(
        "http://localhost:8080/thread/commentComments/" + props.root.commentId,
        {}
      );
    } catch (error) {
      console.log(error);
      return;
    }
    setComments(commentResult.data.comments);
  }

  async function getUser() {
    try {
      threadResult = await axios.get<{
        message: string;
        threads?: Thread[];
      }>("http://localhost:8080/user/" + props.root.author, {});
    } catch (error) {
      console.log(error);
    }
    setThreads(threadResult.data.user);
  }

  let threadResult: AxiosResponse;

  useEffect(() => {
    getUser();
    getComments();
  }, []);
  let author;
  if (user) {
    author = user?.username;
  }

  const list: JSX.Element[] = [];
  if (comments) {
    for (const comment of comments) {
      list.push(<ThreadComment root={comment} />);
    }
  }

  const context: string = props.root.content;
  return (
    <li>
      <div className="category-box container-fluid px-4">
        <div className="row">
          <p className="category-box__row__thread-title col-3">
            <a href="thread.html" className="link">
              {author}
            </a>
          </p>
          <p className="category-box__row__thread-title col-3">
            <a href="thread.html" className="link">
              Thread 1 Title
            </a>
          </p>
        </div>
        <div className="category-box__thread-desc">
          <p>{context}</p>
        </div>
      </div>
      <ul>{list}</ul>
    </li>
  );
};

export default ThreadComment;

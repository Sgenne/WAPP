import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import ThreadComment from "./ThreadComment";

const ThreadPage = () => {
  const list = [];
  for (var i = 0; i < 8; i++) {
    list[i] = <ThreadComment threadId={i}/>;
  }
  const title:string = "Title - A new hope";
  const context:string = "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader."
  const author: string = "Luke"
  const discrod = require('./../resources/img/discrod.png');
  const likes: number = 1336;
  const dislikes: number = 419;
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
              <p>
                {context}
              </p>
            </div>
            <div className="row">
              <div className="col-2">
                <FaThumbsUp />
                <p className="threadLikes">
                {likes}
                </p>
              </div>
              <div className="col-2">
                <FaThumbsDown /> 
                <p className="threadLikes">
                {dislikes}
                </p>
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

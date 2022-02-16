import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import ThreadComment from "./ThreadComment";

const ThreadPage = () => {
  const list = [];
  for (var i = 0; i < 8; i++) {
    list[i] = <ThreadComment />;
  }
  return (
    <div className="wholePage">
      <ul>
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row">
              <img src="resources/img/discrod.png" className="row__avatar" />
              <div className="col row">
                <h3 className="thread-title col-12">
                  <a href="thread.html" className="link">
                    
                    /*TODO title*/
                  </a>
                </h3>
                <p className="row__thread-title col-3">
                  <a href="thread.html" className="link">
                   
                    /*TODO User*/
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
                Category1 Description. On the road again Just can't wait to get
                on the road again The life I love is making music with my
                friends And I can't wait to get on the road again...
              </p>
            </div>
            <div className="row">
              <div className="col-2">
                <FaThumbsUp />
                Likes
              </div>
              <div className="col-2">
                <FaThumbsDown /> Dislikes
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

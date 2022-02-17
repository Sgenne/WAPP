const ThreadComment = () => {
  const commentId: number = 0;
  const author: string = "anakin";
  const context: string = "I am a father";
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
      //TODO add replies
    </li>
  );
};

export default ThreadComment;

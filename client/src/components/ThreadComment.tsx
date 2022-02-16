const ThreadComment = () => {
  return (
    <li>
      <div className="category-box container-fluid px-4">
        <div className="row">
          <p className="category-box__row__thread-title col-3">
            <a href="thread.html" className="link">
              Thread 1 Title
            </a>
          </p>
          <p className="category-box__row__thread-title col-3">
            <a href="thread.html" className="link">
              Thread 1 Title
            </a>
          </p>
        </div>
        <div className="category-box__thread-desc">
          <p>
            Category1 Description. On the road again Just can't wait to get on
            the road again The life I love is making music with my friends And I
            can't wait to get on the road again...
          </p>
        </div>
      </div>
    </li>
  );
};

export default ThreadComment;

import { useNavigate, useParams } from "react-router-dom";
import ThreadPreview from "./ThreadPreview";

const CategoryPage = () => {
  /*const list = [];
  for (var i = 0; i < 8; i++) {
    list[i] = <ThreadPreview thread={null}/>;
  }*/
  const param = useParams();
  const category = param.category;
  const navigate = useNavigate();
  const submitClickHandler = async () => {
    navigate(`/create-thread/${category}`);
  };
  return (
    <div className="wholePage">
      <ul>
        <li className="row">
          <div className="col-sm-5"></div>
          <div className="col-sm-2">
            <h1 id="catigory-title">{category}</h1>
          </div>
          <div className="col-sm-3"></div>
          <div className="col-sm-2">
            <button className="button button--grey newThreadButton" onClick={submitClickHandler}>
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
        {/*list*/}
      </ul>
    </div>
  );
};

export default CategoryPage;

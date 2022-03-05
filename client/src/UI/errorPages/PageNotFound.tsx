import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBackClickHandler = () => {
    navigate(-1);
  };

  const goHomeClickHandler = () => {
    navigate("/");
  };

  return (
    <div className="page-not-found container-fluid">
      <h1 className="page-not-found__header">404</h1>
      <p className="page-not-found__description">
        Oops... The page you're looking for doesn't exist...
      </p>
      <div className="page-not-found__buttons col-md-6 col-6">
        <button
          className="mx-md-2 col-md-4 col-12"
          onClick={goBackClickHandler}
        >
          Go Back
        </button>
        <button
          className="mx-md-2 col-md-4 col-12"
          onClick={goHomeClickHandler}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;

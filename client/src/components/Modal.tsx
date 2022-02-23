import { useEffect } from "react";

const Modal = (props: {
  children: JSX.Element;
  onBackgroundClick: () => void;
}) => {
  
  // Hide scrollbar while modal is shown.
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "default";
    };
  }, []);

  return (
    <>
      <div
        onClick={props.onBackgroundClick}
        className="modal__background"
      ></div>
      <div className="modal__content">{props.children}</div>
    </>
  );
};

export default Modal;

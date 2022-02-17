const Modal = (props: {
  children: JSX.Element;
  onBackgroundClick: () => void;
}) => {
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

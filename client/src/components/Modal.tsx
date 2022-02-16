const Modal = (props: { children: JSX.Element }) => {
  return (
    <>
      <div className="modal__background"></div>
      <div className="modal__content">{props.children}</div>
    </>
  );
};

export default Modal;

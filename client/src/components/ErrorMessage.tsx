const ErrorMessage = (props: { children: string }) => {
  const className = props.children ? "error-message" : "hide";

  return <div className={className}>{props.children}</div>;
};

export default ErrorMessage;

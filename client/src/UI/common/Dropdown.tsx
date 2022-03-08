const Dropdown = (props: {
  options: { title: string; onClick: () => void; icon: JSX.Element }[];
  show: boolean;
}) => {
  const options = props.options.map((option) => (
    <li
      className="dropdown__option container"
      key={option.title}
      onClick={option.onClick}
    >
      <span className="dropdown__option-icon col-12 col-md-2">
        {option.icon}
      </span>
      <span className="col-10 d-none d-md-inline">{option.title}</span>
    </li>
  ));

  const className = props.show ? "dropdown" : "hide";

  return <ul className={className}>{options}</ul>;
};

export default Dropdown;

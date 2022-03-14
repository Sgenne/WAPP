import { NavLink } from "react-router-dom";
import parse from "html-react-parser";

const ListItem = (props: {
  header?: string;
  content: string;
  info?: string;
  link?: string;
}): JSX.Element => {
  let content = props.content;
  if (content.length > 100) {
    content = content.substring(0, 100) + "...";
  }
  const listItemContent = (
    <>
      {props.header && (
        <h4 className="profile-list-item__header">{props.header}</h4>
      )}
      <div className="profile-list-item__content">{parse(content)}</div>
      {props.info && (
        <div className="profile-list-item__info">{props.info}</div>
      )}
    </>
  );

  if (props.link) {
    return (
      <li className="profile-list-item">
        <NavLink to={props.link}>{listItemContent}</NavLink>
      </li>
    );
  }

  return <li className="profile-list-item">{listItemContent}</li>;
};

export default ListItem;

import React from "react";
import { NavLink } from "react-router-dom";
import parse from "html-react-parser";

const ProfileListItem = (props: {
  header?: string;
  content: string;
  info?: string;
  link?: string;
}) => {
  let content = props.content;
  if (content.length > 100) {
    content = content.substring(0, 100) + "...";
  }
  if (props.link) console.log(props.link);
  const listItem = (
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
        <NavLink to={props.link}>{listItem}</NavLink>
      </li>
    );
  }

  return <li className="profile-list-item">{listItem}</li>;
};

export default ProfileListItem;

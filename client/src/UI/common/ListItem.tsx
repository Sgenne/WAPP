import React from "react";
import { NavLink } from "react-router-dom";
import parse, { HTMLReactParserOptions } from "html-react-parser";
import { isTag, isText } from "domhandler";

const options: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (isTag(domNode) && domNode.name === "a" && domNode.firstChild) {
      const child = domNode.firstChild;

      return isText(child) ? <>{child.data}</> : child;
    }
    return domNode;
  },
};

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
  const listItem = (
    <>
      {props.header && (
        <h4 className="profile-list-item__header">{props.header}</h4>
      )}
      <div className="profile-list-item__content">
        {parse(content, options)}
      </div>
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

export default ListItem;

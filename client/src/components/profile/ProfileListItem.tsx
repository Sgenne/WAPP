import React from 'react'

const ProfileListItem = (props: {header?: string, content: string, info?: string    }) => {

    let content = props.content;
    if (content.length > 100) {
        content = content.substring(0,100) + "...";
    }

  return (
    <div className="profile-list-item">
        {props.header && <h5 className='profile-list-item__header'>{props.header}</h5>}
        <div className='profile-list-item__content'>{content}</div>
        {props.info && <div className='profile-list-item__info'>{props.info}</div>}
    </div>
  )
}

export default ProfileListItem
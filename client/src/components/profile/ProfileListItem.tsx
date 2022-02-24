import React from 'react'

const ProfileListItem = (props: {header: string, content: string, date: string    }) => {

    let content = props.content;
    if (content.length > 100) {
        content = content.substring(0,100) + "...";
    }

  return (
    <div className="profile-list-item">
        <h5 className='profile-list-item__header'>{props.header}</h5>
        <div className='profile-list-item__content'>{content}</div>
        <div className='profile-list-item__date'>Posted at: {props.date}</div>
    </div>
  )
}

export default ProfileListItem
import React, { useState } from "react";
///////////////////////////////////START OF DUMMIES///////////////////////////////////////////////////////////////
const dummy = {
  username: "Toast",
  userId: 1,
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/ToastedWhiteBread.jpg/800px-ToastedWhiteBread.jpg",
  bio: "I'm burnt",
  likedThread: [],
  dislikedThread: [],
};
const dummyThreads = [
  {
    author: 1,
    content:
      "Toast is bread that has been browned by radiant heat. The browning is the result of a Maillard reaction, altering the flavor of the bread and making it firmer so that it is easier to spread toppings on it. Toasting is a common method of making stale bread more palatable. Bread is often toasted using a toaster, but toaster ovens are also used. Pre-sliced bread is most commonly used.",
    title: "About me",
    date: new Date().toISOString(),
  },
  {
    author: 1,
    content:
      "Toast is bread that has been browned by radiant heat. The browning is the result of a Maillard reaction, altering the flavor of the bread and making it firmer so that it is easier to spread toppings on it. Toasting is a common method of making stale bread more palatable. Bread is often toasted using a toaster, but toaster ovens are also used. Pre-sliced bread is most commonly used.",
    title: "About me",
    date: new Date().toISOString(),
  },
  {
    author: 1,
    content:
      "Toast is bread that has been browned by radiant heat. The browning is the result of a Maillard reaction, altering the flavor of the bread and making it firmer so that it is easier to spread toppings on it. Toasting is a common method of making stale bread more palatable. Bread is often toasted using a toaster, but toaster ovens are also used. Pre-sliced bread is most commonly used.",
    title: "About me",
    date: new Date().toISOString(),
  },
];
const dummyComments = [
  {
    author: 1,
    content: "I also like to be soaked in butter",
    date: new Date().toISOString(),
  },
  {
    author: 1,
    content:
      "I like to be covered in jelly while my partner prefers peanutbutter",
    date: new Date().toISOString(),
  },
  {
    author: 1,
    content: "I like to be soaked in chocospread",
    date: new Date().toISOString(),
  },
];
///////////////////////////////////END OF DUMMIES///////////////////////////////////////////////////////////////
const defaultImage =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
const defaultBio = "";

let displayedThreads = dummyThreads.map((thread) => (
  <li>
    <h4>{thread.title}</h4>
    <span>Posted at: {thread.date.substring(0, 10)}</span>
  </li>
));
const ProfilePage = () => {
  const userImage = dummy.image || defaultImage;
  const userBio = dummy.bio || defaultBio;

  const threadClickHandler = () => {
    displayedThreads = dummyThreads.map((thread) => (
      <li>
        <h4>{thread.title}</h4>
        <span>Posted at: {thread.date.substring(0, 10)}</span>
      </li>
    ));
  };

  const commentClickHandler = () => {
    displayedThreads = dummyThreads.map((thread) => (
      <li>
        <h4>{thread.title}</h4>
        <span>Posted at: {thread.date.substring(0, 10)}</span>
      </li>
    ));
  };

  const likedClickHandler = () => {
    displayedThreads = dummyThreads.map((thread) => (
      <li>
        <h4>{thread.title}</h4>
        <span>Posted at: {thread.date.substring(0, 10)}</span>
      </li>
    ));
  };

  const dislikedClickHandler = () => {
    displayedThreads = dummyThreads.map((thread) => (
      <li>
        <h4>{thread.title}</h4>
        <span>Posted at: {thread.date.substring(0, 10)}</span>
      </li>
    ));
  };

  return (
    <div>
      <div className="profile-page__userInfo">
        <img className="profile-page__image" src={userImage} />
        <h1 className="profile-page__username"> {dummy.username}</h1>
        <p className="profile-page__bio"> {userBio}</p>
      </div>
      <div className="profile-page__thread-buttons">
        <button onClick={threadClickHandler}>Threads</button>
        <button onClick={commentClickHandler}>Comments</button>
        <button onClick={likedClickHandler}>Liked</button>
        <button onClick={dislikedClickHandler}>Disliked</button>
      </div>
      <ul className="profile-page__displayedThreads">{displayedThreads}</ul>
    </div>
  );
};

export default ProfilePage;

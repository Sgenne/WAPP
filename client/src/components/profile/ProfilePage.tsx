import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatUtils";
import ProfileListItem from "./ProfileListItem";
import { Thread } from "../../../../server/src/model/thread.interface";
import axios, { AxiosResponse } from "axios";
import { User } from "../../../../server/src/model/user.interface";
///////////////////////////////////START OF DUMMIES///////////////////////////////////////////////////////////////

const dummyUserId = 1;

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
    parentThread: dummyThreads[0],
    author: 1,
    content: "I also like to be soaked in butter",
    date: new Date().toISOString(),
  },
  {
    parentThread: dummyThreads[0],
    author: 1,
    content:
      "I like to be covered in jelly while my partner prefers peanutbutter",
    date: new Date().toISOString(),
  },
  {
    parentThread: dummyThreads[0],
    author: 1,
    content: "I like to be soaked in chocospread",
    date: new Date().toISOString(),
  },
];

///////////////////////////////////END OF DUMMIES///////////////////////////////////////////////////////////////

const ProfilePage = () => {
  const [user, setUser] = useState<User>();
  const [createdThreads, setCreatedThreads] = useState<Thread[]>([]);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetchUser(dummyUserId);
    fetchCreatedThreads(dummyUserId);
  }, []);

  const fetchUser = async (userId: Number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ user: User }>(
        `http://localhost:8080/user/${userId}`
      );
    } catch (error) {
      console.log(error); // TODO: Show error
      return;
    }
    setUser(response.data.user);
  };

  const fetchCreatedThreads = async (userId: Number): Promise<void> => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ threads: Thread[] }>(
        `http://localhost:8080/thread/author/${userId}`
      );
    } catch (error) {
      console.log(error); // TODO: Show error
      return;
    }
    const fetchedThreads: Thread[] = response.data.threads;

    setCreatedThreads(fetchedThreads);
    setListItems(
      fetchedThreads.map((thread) => (
        <ProfileListItem
          header={thread.title}
          content={thread.content}
          date={formatDate(new Date(thread.date))}
        />
      ))
    );
  };

  const threadClickHandler = () => {
    // send GET to /thread/author/:userId
    const threadListItems = createdThreads.map((thread) => (
      <ProfileListItem
        header={thread.title}
        content={thread.content}
        date={formatDate(new Date(thread.date))}
      />
    ));
    setListItems(threadListItems);
  };

  const commentClickHandler = () => {
    // send GET to /comment/author/:userId
    const commentListItems = dummyComments.map((comment) => (
      <ProfileListItem
        header={comment.parentThread.title}
        content={comment.content}
        date={comment.date}
      />
    ));
    setListItems(commentListItems);
  };

  // send GET to /thread/liked-by/:userId
  const likedThreadsClickHandler = () => {
    const likedListItems = dummyThreads.map((thread) => (
      <ProfileListItem
        header={thread.title}
        content={thread.content}
        date={formatDate(new Date(thread.date))}
      />
    ));
    setListItems(likedListItems);
  };

  // send GET to /comment/liked-by/:userId
  const likedCommentsClickHandler = () => {
    const dislikedListItems = dummyThreads.map((thread) => (
      <ProfileListItem
        header={thread.title}
        content={thread.content}
        date={thread.date}
      />
    ));
    setListItems(dislikedListItems);
  };

  if (!user) return <div>Loading...........</div>;

  return (
    <div className="profile-page">
      <div className="profile-page__userInfo">
        <img
          className="profile-page__image"
          src={user.image.imageUrl}
          alt="profile"
        />
        <h1 className="profile-page__username"> {user.username}</h1>
        <p className="profile-page__bio"> {user.bio}</p>
      </div>
      <div className="profile-page__thread-buttons">
        <button onClick={threadClickHandler}>Threads</button>
        <button onClick={commentClickHandler}>Comments</button>
        <button onClick={likedThreadsClickHandler}>Liked Threads</button>
        <button onClick={likedCommentsClickHandler}>Liked Comments</button>
      </div>
      <ul className="profile-page__displayed-threads">{listItems}</ul>
    </div>
  );
};

export default ProfilePage;

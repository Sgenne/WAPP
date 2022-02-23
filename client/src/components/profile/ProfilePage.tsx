import React, { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatUtils";
import ProfileListItem from "./ProfileListItem";
import { Thread } from "../../../../server/src/model/thread.interface";
import { Comment } from "../../../../server/src/model/comment.interface";
import axios, { AxiosResponse } from "axios";
import { User } from "../../../../server/src/model/user.interface";
///////////////////////////////////START OF DUMMIES///////////////////////////////////////////////////////////////

const dummyUserId = 1;

///////////////////////////////////END OF DUMMIES///////////////////////////////////////////////////////////////

const ProfilePage = () => {
  const [user, setUser] = useState<User>();
  const [createdThreads, setCreatedThreads] = useState<Thread[]>([]);
  const [createdComments, setCreatedComments] = useState<Comment[]>([]);
  const [likedThreads, setLikedThreads] = useState<Thread[]>([]);
  const [likedComments, setLikedComments] = useState<Comment[]>([]);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    fetchUser(dummyUserId);
    fetchCreatedThreads(dummyUserId);
    fetchCreatedComments(dummyUserId);
    fetchLikedThreads(dummyUserId);
    fetchLikedComments(dummyUserId);
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


  const fetchCreatedComments = async (userId: number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ comments: Comment[] }>(
        `http://localhost:8080/comment/author/${userId}`
      );
    } catch (error) {
      console.log(error); // TODO: Show error
      return;
    }

    setCreatedComments(response.data.comments)
  } 

  const fetchLikedThreads = async (userId: Number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ threads: Thread[] }>(
        `http://localhost:8080/thread/likedThreads/${dummyUserId}`
      );
    } catch (error) {
      console.log(error); // TODO: Show error
      return;
    }

    console.log("fetched liked threads: ", response.data.threads)

    setLikedThreads(response.data.threads);
  };

  const fetchLikedComments = async (userId: Number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ comments: Comment[] }>(
        `http://localhost:8080/comment/likedComments/${userId}`
      );
    } catch (error) {
      console.log(error); // TODO: Show error
      return;
    }

    console.log("comments liked: ", response.data.comments)

    setLikedComments(response.data.comments);
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
    const commentListItems = createdComments.map((comment) => (
      <ProfileListItem
        header={""}
        content={comment.content}
        date={formatDate(new Date(comment.date))}
      />
    ));
    setListItems(commentListItems);
  };

  // send GET to /thread/liked-by/:userId
  const likedThreadsClickHandler = () => {
    const threadListItems = likedThreads.map((thread) => (
      <ProfileListItem
        header={thread.title}
        content={thread.content}
        date={formatDate(new Date(thread.date))}
      />
    ));
    setListItems(threadListItems);
  };

  // send GET to /comment/liked-by/:userId
  const likedCommentsClickHandler = () => {
    const commentListItems = likedComments.map((comment) => (
      <ProfileListItem
        header={""}
        content={comment.content}
        date={formatDate(new Date(comment.date))}
      />
    ));
    setListItems(commentListItems);
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

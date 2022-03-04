import { useCallback, useContext, useEffect, useState } from "react";
import { formatDate } from "../../utils/formatUtils";
import ProfileListItem from "./ProfileListItem";
import { Thread } from "../../../../server/src/model/thread.interface";
import { Comment } from "../../../../server/src/model/comment.interface";
import axios, { AxiosResponse } from "axios";
import { User } from "../../../../server/src/model/user.interface";
import { AuthContext } from "../../context/AuthContext";
import { useParams } from "react-router-dom";
import { FaEdit, FaPencilAlt } from "react-icons/fa";
import EditProfilePopup from "./EditProfilePopup";

const ProfilePage = () => {
  const [owner, setOwner] = useState<User>();
  const [createdThreads, setCreatedThreads] = useState<Thread[]>([]);
  const [createdComments, setCreatedComments] = useState<Comment[]>([]);
  const [likedThreads, setLikedThreads] = useState<Thread[]>([]);
  const [likedComments, setLikedComments] = useState<Comment[]>([]);
  const [listItems, setListItems] = useState<JSX.Element[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<Error>();

  const authContext = useContext(AuthContext);
  const params = useParams();

  if (!params.username) {
    throw new Error("Invalid username");
  }

  const ownerName = params.username;

  useEffect(() => {
    if (!ownerName) return;
    fetchUser(ownerName);
  }, [ownerName]);

  useEffect(() => {
    if (!owner) return;

    const ownerId = owner.userId;
    fetchCreatedThreads(ownerId);
    fetchCreatedComments(ownerId);
    fetchLikedThreads(ownerId);
    fetchLikedComments(ownerId);
  }, [owner]);

  const fetchUser = async (username: string) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ user: User }>(
        `http://localhost:8080/user/username/${username}`
      );
    } catch (error) {
      setError(new Error("No user with the given username was found."));
      return;
    }
    setOwner(response.data.user);
  };

  const fetchCreatedThreads = async (userId: number): Promise<void> => {
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
  };

  const fetchCreatedComments = async (userId: number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ comments: Comment[] }>(
        `http://localhost:8080/comment/author/${userId}`
      );
    } catch (error) {
      setError(new Error("Created comments could not be fetched."));
      return;
    }

    setCreatedComments(response.data.comments);
  };

  const fetchLikedThreads = async (userId: Number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ threads: Thread[] }>(
        `http://localhost:8080/thread/liked/${userId}`
      );
    } catch (error) {
      setError(new Error("Liked threads could not be fetched."));
      return;
    }

    setLikedThreads(response.data.threads);
  };

  const fetchLikedComments = async (userId: Number) => {
    let response: AxiosResponse;

    try {
      response = await axios.get<{ comments: Comment[] }>(
        `http://localhost:8080/comment/likedComments/${userId}`
      );
    } catch (error) {
      setError(new Error("Liked comments could not be fetched."));
      return;
    }

    setLikedComments(response.data.comments);
  };

  const showCreatedThreads = useCallback(() => {
    const threadListItems = createdThreads.map((thread) => (
      <div className="profile-page__list-item" key={thread.threadId}>
        <ProfileListItem
          header={thread.title}
          content={thread.content}
          info={`Posted at: ${formatDate(new Date(thread.date))}`}
          link={`/thread/${thread.threadId}`}
          key={thread.threadId}
        />
      </div>
    ));
    setListItems(threadListItems);
  }, [createdThreads]);

  // Show created threads when page is loaded.
  useEffect(() => {
    showCreatedThreads();
  }, [showCreatedThreads]);

  const showCreatedComments = () => {
    const commentListItems = createdComments.map((comment) => (
      <div className="profile-page__list-item" key={comment.commentId}>
        <ProfileListItem
          content={comment.content}
          info={`Posted at: ${formatDate(new Date(comment.date))}`}
          link={`/thread/${comment.rootThread}`}
        />
      </div>
    ));
    setListItems(commentListItems);
  };

  const showLikedThreads = () => {
    const threadListItems = likedThreads.map((thread) => (
      <div className="profile-page__list-item" key={thread.threadId}>
        <ProfileListItem
          header={thread.title}
          content={thread.content}
          info={`Posted at: ${formatDate(new Date(thread.date))}`}
          link={`/thread/${thread.threadId}`}
        />
      </div>
    ));
    setListItems(threadListItems);
  };

  const showLikedComments = () => {
    const commentListItems = likedComments.map((comment) => (
      <div className="profile-page__list-item" key={comment.commentId}>
        <ProfileListItem
          content={comment.content}
          info={`Posted at: ${formatDate(new Date(comment.date))}`}
          //link={`/thread/${comment.thread}`}
        />
      </div>
    ));
    setListItems(commentListItems);
  };

  const showSettingsHandler = () => {
    setShowSettings(true);
  };

  const hideSettingsHandler = () => {
    setShowSettings(false);
  };

  const updateOwnerHandler = (updatedOwner: User) => {
    setOwner(updatedOwner);
  };

  if (error) return <div>{error.message}</div>;
  if (!owner) return <div>Loading...........</div>;

  const isOwner =
    authContext.signedInUser &&
    authContext.signedInUser.userId === owner.userId;

  return (
    <div className="profile-page">
      {showSettings && (
        <EditProfilePopup
          owner={owner}
          onClose={hideSettingsHandler}
          onUpdateOwner={updateOwnerHandler}
        />
      )}
      <div className="profile-page__userInfo">
        <img
          className="profile-page__image"
          src={owner.image.imageUrl}
          alt="profile"
        />
        <h1 className="profile-page__username">
          {" "}
          {owner.username}
          {isOwner && (
            <button
              className="profile-page__settings-button"
              onClick={showSettingsHandler}
            >
              <FaEdit className="profile-page__settings-icon" />
            </button>
          )}
        </h1>
        <p className="profile-page__bio"> {owner.bio}</p>
      </div>
      <div className="profile-page__thread-buttons container-fluid">
        <div className="row">
          <button className="col-lg-3" onClick={showCreatedThreads}>
            Threads
          </button>
          <button className="col-lg-3" onClick={showCreatedComments}>
            Comments
          </button>
          <button className="col-lg-3" onClick={showLikedThreads}>
            Liked Threads
          </button>
          <button className="col-lg-3" onClick={showLikedComments}>
            Liked Comments
          </button>
        </div>
      </div>
      <div className="container-fluid d-flex  justify-content-center">
        <ul className="profile-page__displayed-threads col-lg-5 col-12">
          {listItems}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;

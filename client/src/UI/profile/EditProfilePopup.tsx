import { useContext, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { User } from "../../../../server/src/model/user.interface";
import Modal from "../common/Modal";
import { AuthContext } from "../../context/AuthContext";
import FormData from "form-data";
import { Image } from "../../../../server/src/model/image.interface";
import { useNavigate } from "react-router-dom";

const EditProfilePopup = (props: {
  onClose: () => void;
  owner: User;
  onUpdateOwner: (updatedOwner: User) => void;
}): JSX.Element => {
  const [newProfilePicture, setNewProfilePicture] = useState<File>();
  const [bio, setBio] = useState(props.owner.bio);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const submitProfilePictureHandler = async (): Promise<void> => {
    if (
      !(newProfilePicture && authContext.signedInUser && authContext.password)
    )
      return;

    let response: AxiosResponse;

    const formData = new FormData();
    formData.append("userId", authContext.signedInUser.userId.toString());
    formData.append("password", authContext.password);
    formData.append("image", newProfilePicture);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    try {
      response = await axios.post<{ message: string; profilePicture: Image }>(
        "http://localhost:8080/user/upload-profile-picture",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
      return;
    }

    const updatedOwner: User = {
      ...props.owner,
      profilePicture: response.data.profilePicture,
    };

    props.onUpdateOwner(updatedOwner);
    props.onClose();
  };

  const submitUserInfoChanges = async (): Promise<void> => {
    if (!authContext.signedInUser) return;

    try {
      await axios.put("http://localhost:8080/user/update-user", {
        userId: authContext.signedInUser.userId,
        password: authContext.password,
        bio: bio,
      });
    } catch (error) {
      console.log(error);
      return;
    }

    const updatedOwner = {
      ...props.owner,
      bio: bio,
    };

    props.onUpdateOwner(updatedOwner);
    props.onClose();
  };

  const deleteUser = async (): Promise<void> => {
    if (!authContext.signedInUser) return;
    const data = {
      userId: authContext.signedInUser.userId,
      password: authContext.password,
    };
    try {
      await axios.delete("http://localhost:8080/user/delete-user", {
        data,
      });
    } catch (error) {
      console.log(error);
      return;
    }
    authContext.setIsSignedIn(false);
    authContext.setSignedInUser(undefined);

    props.onClose();
    navigate("/");
  };

  const profilePictureChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    if (!event.target.files) return;

    setNewProfilePicture(event.target.files[0]);
  };

  const bioChangeHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setBio(event.target.value);
  };

  return (
    <Modal onBackgroundClick={props.onClose}>
      <div className="edit-profile">
        <div className="edit-profile__profile-picture">
          <div className="edit-profile__profile-picture-input">
            <label>Update your profile picture</label>
            <input
              className="edit-profile__profile-picture-input-square"
              type="file"
              onChange={profilePictureChangeHandler}
            />
          </div>

          <button onClick={submitProfilePictureHandler}>Submit picture</button>
        </div>
        <div className="edit-profile__user-info">
          <div className="edit-profile__bio">
            <label>Edit bio:</label>
            <textarea
              className="edit-profile__bio-text-area"
              onChange={bioChangeHandler}
              defaultValue={bio}
            ></textarea>
            <div className="edit-profile__user-info-buttons">
              <button onClick={submitUserInfoChanges}>Submit bio</button>
              <button onClick={props.onClose}>Cancel</button>
              <button onClick={deleteUser}>Delete user</button>
              
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfilePopup;

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../../../server/src/model/user.interface";
import Modal from "../Modal";
import { AuthContext } from "../../context/AuthContext";
import FormData from "form-data";

const EditProfilePopup = (props: {
  onClose: () => void;
  currentUser: User;
}) => {
  const [newProfilePicture, setNewProfilePicture] = useState<File>();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const submitProfilePictureHandler = async () => {
    if (!(newProfilePicture && authContext.userId && authContext.password))
      return;

    const formData = new FormData();
    formData.append("userId", authContext.userId.toString());
    formData.append("password", authContext.password);
    formData.append("image", newProfilePicture);

    const config = {
      headers: { "content-type": "multipart/form-data" },
    };

    try {
      await axios.post(
        "http://localhost:8080/user/upload-profile-picture",
        formData,
        config
      );
    } catch (error) {
      console.log(error);
      return;
    }


    navigate(`/profile/${authContext.username}`);
    props.onClose();
  };

  const profilePictureChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    setNewProfilePicture(event.target.files[0]);
  };

  return (
    <Modal onBackgroundClick={props.onClose}>
      <div className="edit-profile">
        <div className="edit-profile__profile-picture">
          <div className="edit-profile__profile-picture-preview">
            <img src="" alt="" />
          </div>
          <input type="file" onChange={profilePictureChangeHandler} />
          <button onClick={submitProfilePictureHandler}>
            Submit profile picture
          </button>
        </div>
        <div className="edit-profile__user-info">
          <label>Edit bio:</label>
          <textarea>{props.currentUser.bio}</textarea>
          <button>Submit changes</button>
          <button>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfilePopup;

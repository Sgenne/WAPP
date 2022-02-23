import { User } from "../../../../server/src/model/user.interface";
import Modal from "../Modal";

const EditProfilePopup = (props: {
  onClose: () => void;
  currentUser: User;
}) => {
  return (
    <Modal onBackgroundClick={props.onClose}>
      <div className="edit-profile">
        <div className="edit-profile__profile-picture">
          <div className="edit-profile__profile-picture-preview">
            <img src="" alt="" />
          </div>
          <input type="file" />
          <button>Submit profile picture</button>
        </div>
        <div className="edit-profile__user-info">
          <label>Edit bio:</label>
          <textarea>{props.currentUser.bio}</textarea>
          <button>Submit changes</button><button>Cancel</button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfilePopup;

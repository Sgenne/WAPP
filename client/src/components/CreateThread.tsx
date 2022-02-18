import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreateThread = () => {
  const [value, setValue] = useState("");
  return (
    <div className="wholePage">
      <ul className="category-list">
        <li>
          <div className="category-box container-fluid px-4">
            <div className="row1">
              <h3 className="thread-title">
                <a href="#" className="link">
                  You are about to create a thread under Category 1
                </a>
              </h3>
            </div>
            <div className="thread-desc">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                malesuada odio at magna faucibus, eget mollis erat tempor.
              </p>
            </div>
          </div>
        </li>
        <li>
          <div id="postthread">
            <input id="threadinput" placeholder="Thread title" />

            <ReactQuill
              id="quill"
              theme="snow"
              value={value}
              onChange={setValue}
            />

            <div id="submitbut">
              <button className="button button--grey" id="subThread">
                Submit Thread
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CreateThread;

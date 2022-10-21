import React, { useState, useEffect } from "react";
import classes from "../Styles/settings.module.css";
import { CameraAlt } from "@material-ui/icons";
import axios from "axios";

export default function UpdateProfileImage() {
  const [coverImage, setCoverImage] = useState("");

  const configure = {
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: localStorage.getItem("accessToken"),
    },
  };

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    axios
      .get("http://localhost:3003/auth/getImages", configure)
      .then((response) => {
        setCoverImage(response.data[0].coverImgId);
      });
  };

  const [updatedImage, setUpdatedImage] = useState({
    file: [],
  });

  const handleInputChange = (event) => {
    setUpdatedImage({
      ...updatedImage,
      file: event.target.files[0],
    });
  };

  const updateImages = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("cover", updatedImage.file);
    console.log(formData);
    axios
      .put("http://localhost:3003/auth/coverImg", formData, configure)
      .then((response) => {
        console.log(response);
      });
  };

  return (
    <>
      <span className={classes.settingsTitleUpdate}>Update Your Images</span>

      <form className={classes.settingsForm} onSubmit={updateImages}>
        <div className={classes.settingsPP}>
          <img src={`http://localhost:3003/auth/images/${coverImage}`} alt="" />
          <label htmlFor="fileInput">
            <span className={classes.PPtext}>
              Click to Choose new Cover Picture
            </span>

            <CameraAlt className={classes.settingsPPIcon} />
          </label>

          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            className={classes.settingsPPInput}
            onChange={handleInputChange}
          />
          <button className={classes.settingsSubmitButton} type="submit">
            Update Profile Picture
          </button>
        </div>
      </form>
    </>
  );
}
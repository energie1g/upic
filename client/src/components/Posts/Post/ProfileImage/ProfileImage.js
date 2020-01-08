import React from "react";
import classes from "./ProfileImage.module.css";

const ProfileImage = props => {
  return (
    <div
      onClick={props.goToCompte}
      style={{ background: "url(" + props.src + ") 30% 30% no-repeat" }}
      className={classes.ProfileImage}
    ></div>
  );
};

export default ProfileImage;

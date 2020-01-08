import React from "react";
import logo from "../../../assets/img/logo.png";
import classes from "./Logo.module.css";

const Logo = props => {
  return <img className={classes.Logo} src={logo} alt="UPic-logo.png"></img>;
};

export default Logo;

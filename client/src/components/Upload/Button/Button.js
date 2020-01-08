import React from "react";
import "./Button.css";

const Button = props => {
  return (
    <button type="button" className="btn upload-button" onClick={props.Post}>
      {props.name}
    </button>
  );
};

export default Button;

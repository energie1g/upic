import React from "react";
import classes from "./Reaction.module.css";

const Reaction = props => {
  return (
    <div onClick={props.toggleComments} className={classes.Reaction}>
      {props.children}
      <span style={{ marginTop: "-3.6px" }}>{props.rate}</span>
    </div>
  );
};

export default Reaction;

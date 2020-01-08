import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import classes from "./Post.module.css";
import { Image } from "semantic-ui-react";
import PostImage from "./PostImage/PostImage";
import Reactions from "./Reactions/Reactions";
import Comments from "./Comments/Comments";
import axios from "axios";
import { Redirect } from "react-router-dom";

export default function(props) {
  const [contentStatus, displayContent] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [redirectToCompte, setRedirectToCompte] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    async function fetchComments() {
      // TODO: Add Authorization header afterwords
      const images = await axios({
        method: "GET",
        url: `http://localhost:8000/api/v1/images/${props.id}`,
        signal: abortController.signal
      });

      const commentsAxios = [];
      const comments = images.data.image.comments;
      for (let i = 0; i < comments.length; i++) {
        let comment = axios.get(
          `http://localhost:8000/api/v1/comments/${comments[i]._id}`
        );
        commentsAxios.push(comment);
      }

      let commentsPopulate = await axios.all(commentsAxios);
      setComments(commentsPopulate);
    }

    fetchComments();

    return () => {
      abortController.abort();
    };
  }, [props.id, props.jwt_token]);

  const contentProps = useSpring({
    opacity: contentStatus ? 1 : 0,
    marginTop: contentStatus ? 10 : -50
  });

  const commentHandler = event => {
    const comment = event.target.value;
    const btnDisabled = comment.match(/^[ \n\b^$]+$/i);

    setComment(comment);
    setBtnDisabled(btnDisabled || comment === "" ? true : false);
  };

  const postComment = async () => {
    setBtnDisabled(true);
    const comm = await axios.post("http://localhost:8000/api/v1/comments", {
      comment,
      user: props.userId,
      image: props.id
    });

    setComments([...comments, comm]);
    setComment("");
  };

  const goToCompte = () => {
    setRedirectToCompte(true);
  };

  if (redirectToCompte) return <Redirect to={`/users/${props.postUserId}`} />;

  return (
    <div className={classes.UpperPost}>
      <Image
        style={{
          overflow: "inherit",
          height: 50,
          width: 50,
          marginRight: 14,
          cursor: "pointer"
        }}
        size="tiny"
        onClick={goToCompte}
        src={props.photo}
        alt="Not available."
        circular
      />
      <div className={classes.UpperPostInfo}>
        <div className={classes.UpperPostID}>
          <span className={classes.UpperPostName} onClick={goToCompte}>
            {props.name}
          </span>
          <span className={classes.UpperPostAt} onClick={goToCompte}>
            {props.nameAt}
          </span>
          <span className={classes.UpperPostDate}>&middot; {props.date}</span>
        </div>
        <div className={classes.UpperPostDesc}>{props.desc}</div>
        <PostImage src={props.src} />
        <Reactions
          id={props.id}
          likes={props.likes}
          user={props.user}
          comments={comments}
          likers={props.likers}
          toggleComments={() => displayContent(a => !a)}
        />
        {contentStatus && (
          <animated.div style={contentProps}>
            <Comments
              comments={comments}
              userId={props.userId}
              imageId={props.id}
              postComment={postComment}
              comment={comment}
              btnDisabled={btnDisabled}
              commentHandler={commentHandler}
            />
          </animated.div>
        )}
      </div>
    </div>
  );
}

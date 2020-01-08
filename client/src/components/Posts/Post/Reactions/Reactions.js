import React, { Component } from "react";
import Reaction from "./Reaction/Reaction";
// import { IoIosThumbsUp } from "react-icons/io";
import classes from "./Reactions.module.css";
import { TiMessage } from "react-icons/ti";
// import { FaRetweet } from "react-icons/fa";
// import { MdMailOutline } from "react-icons/md";
import { IoIosHeart } from "react-icons/io";
import { IoIosHeartEmpty } from "react-icons/io";
import axios from "axios";

const SERVER_URL = "http://localhost:8000/api/v1/images";

class Reactions extends Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      liked: false,
      likes: props.likes
    };
  }

  componentDidMount() {
    this.mounted = true;
    const likers = this.props.likers.find(el => el === this.props.user.id);
    this.mounted &&
      this.setState({
        liked: likers === undefined ? false : true
      });
  }

  pointer = { cursor: "pointer" };

  Like = async () => {
    try {
      const like = await axios.patch(`${SERVER_URL}/${this.props.id}/like`, {
        liker: this.props.user.id
      });

      const likers = await axios.get(
        `${SERVER_URL}/${this.props.id}/${this.props.user.id}`
      );

      this.setState({
        likes: like.data.image.likes,
        liked: likers.data.liker === 0 ? false : true
      });
    } catch (error) {}
  };

  render() {
    return (
      <div className={classes.Reactions}>
        <Reaction rate={this.state.likes}>
          {this.state.liked ? (
            <IoIosHeart onClick={this.Like} className={classes.HeartIcon} />
          ) : (
            <IoIosHeartEmpty
              onClick={this.Like}
              className={classes.HeartIcon}
            />
          )}
        </Reaction>
        <Reaction
          toggleComments={this.props.toggleComments}
          rate={this.props.comments.length}
        >
          <TiMessage style={this.pointer} />
        </Reaction>
        {/* <Reaction rate="78">
          <FaRetweet style={this.pointer} />
        </Reaction>
        <Reaction rate="">
          <MdMailOutline style={this.pointer} />
        </Reaction> */}
      </div>
    );
  }
}

export default Reactions;

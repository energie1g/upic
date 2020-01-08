import React from "react";
import { Pagination } from "semantic-ui-react";
import axios from "axios";
import Post from "./Post/Post";
import classes from "./Posts.module.css";
import { Redirect } from "react-router-dom";

const IMAGES_PER_PAGE = 6;

class Posts extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;

    this.state = {
      images: [],
      imagesPerPage: [],
      begin: 0,
      end: 6,
      totalPages: 0,
      user: null,
      jwt_token: props.cookies.get("jwt")
        ? props.cookies.get("jwt").split(" ")[0]
        : null,
      user_id: props.cookies.get("jwt")
        ? props.cookies.get("jwt").split(" ")[1]
        : null,
      redirect: false
    };
  }

  async componentDidMount() {
    console.log("[Posts - componentDidMount]");
    let totalPages;
    this.mounted = true;
    if (this.state.jwt_token) {
      const images = await axios({
        method: "GET",
        url: "http://localhost:8000/api/v1/images",
        headers: { Authorization: `Bearer ${this.state.jwt_token}` }
      });

      const user = await axios({
        method: "GET",
        url: `http://localhost:8000/api/v1/users/${this.state.user_id}`
      });

      if (images) {
        totalPages = Math.ceil(images.data.images.length / IMAGES_PER_PAGE);
      }

      this.mounted &&
        this.setState({
          images: images.data.images,
          user: user.data.user,
          redirect: false,
          totalPages
        });
    } else {
      this.mounted &&
        this.setState({
          redirect: true
        });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  paginationHandler = (event, data) => {
    let arr = [...this.state.images];
    let begin = data.activePage * IMAGES_PER_PAGE - IMAGES_PER_PAGE;
    let end = data.activePage * IMAGES_PER_PAGE;
    let modifiedArr = arr.slice(begin, end);

    console.log("[App] >> paginationHandler >> TRACKS", this.state.tracks);
    console.log("[App] >> paginationHandler >> Array", modifiedArr);
    console.log("[App] >> paginationHandler >> Begin", begin);
    console.log("[App] >> paginationHandler >> End", end);

    this.setState({
      begin,
      end
    });
  };

  render() {
    let dbImages = [...this.state.images];
    let images = null;
    if (dbImages !== null) {
      dbImages = dbImages.slice(this.state.begin, this.state.end);
      console.log("Images modified", dbImages);
      images = dbImages.map((el, ind) => {
        return (
          <Post
            postUserId={el.user ? el.user.id : null}
            key={el.id}
            src={el.imgUrl}
            name={el.user ? el.user.nom : ""}
            nameAt={`@${el.user ? el.user.nom : ""}`}
            photo={el.user ? el.user.photo : ""}
            date={el.createdAt.slice(0, 10)}
            desc={el.description}
            likes={el.likes}
            id={el.id}
            likers={el.likers}
            user={this.state.user}
            userId={this.state.user_id}
            jwt_token={this.state.jwt_token}
          />
        );
      });
    }

    return (
      <div className={classes.Posts}>
        {!this.state.redirect ? images : <Redirect to="/login" />}
        {this.state.images && this.state.images.length > IMAGES_PER_PAGE ? (
          <div className={classes.Pagination}>
            <Pagination
              defaultActivePage={1}
              onPageChange={this.paginationHandler}
              totalPages={this.state.totalPages}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default Posts;

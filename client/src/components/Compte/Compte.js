import React from "react";
import classes from "./Compte.module.css";
import * as FilePond from "filepond";
import FilePondPluginImageEdit from "filepond-plugin-image-edit";
import "filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Image, Button, Icon, Divider } from "semantic-ui-react";
import NoMatch from "../../pages/error/NoMatch";

FilePond.registerPlugin(FilePondPluginImageEdit);

const SERVER_URL = "http://localhost:8000/api/v1/users";

class Compte extends React.Component {
  constructor(props) {
    super(props);

    this.mounted = false;
    this.jwt_token = props.cookies.get("jwt")
      ? props.cookies.get("jwt").split(" ")[0]
      : null;
    this.user_id = props.cookies.get("jwt")
      ? props.cookies.get("jwt").split(" ")[1]
      : null;

    this.state = {
      jwt_token: this.jwt_token,
      user_id: this.user_id,
      redirectToLogin: false,
      currentUser: null,
      fLoading: false,
      pLoading: false,
      followBtnClr: "blue",
      wrongUserId: false,
      abonnes: 0,
      abonnements: 0,
      pHover: false,
      pFile: null
    };
  }

  fileInputRef = React.createRef();

  async componentDidMount() {
    this.mounted = true;
    let redirectToLogin = this.state.jwt_token === null;
    let currentUser = null;
    let isFollowing;
    let wrongUserId = false;

    if (!redirectToLogin) {
      try {
        currentUser = await axios({
          method: "GET",
          url: `http://127.0.0.1:8000/api/v1/users/${this.props.match.params.id}`
        });

        isFollowing = await axios.get(
          `${SERVER_URL}/${this.props.match.params.id}/${this.state.user_id}`
        );

        this.mounted &&
          this.setState({
            redirectToLogin,
            currentUser: currentUser.data.user,
            followBtnClr: isFollowing.data.abonne === 0 ? "blue" : "grey",
            abonnes: currentUser.data.user.abonnes.length,
            abonnements: currentUser.data.user.abonnements.length
          });
      } catch (err) {
        wrongUserId = true;
      }
      this.setState({ wrongUserId });
    }
  }

  handleFollow = async () => {
    try {
      this.setState({
        fLoading: true
      });
      const abonne = await axios.patch(
        `${SERVER_URL}/${this.props.match.params.id}/follow`,
        {
          abonne: this.state.user_id
        }
      );

      const isFollowing = await axios.get(
        `${SERVER_URL}/${this.props.match.params.id}/${this.state.user_id}`
      );

      this.setState({
        fLoading: false,
        followBtnClr: isFollowing.data.abonne === 0 ? "blue" : "grey",
        abonnes: abonne.data.userToFollow.abonnes.length,
        abonnements: abonne.data.userToFollow.abonnements.length
      });
    } catch (error) {
      this.setState({ fLoading: false });
    }
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  profileImageOnMouseEnterHandler = () => {
    this.setState({
      pHover: true,
      pCursor: "pointer"
    });
  };

  profileImageOnMouseLeaveHandler = () => {
    this.setState({
      pHover: false,
      pCursor: "default"
    });
  };

  fileChange = async e => {
    this.setState({ pFile: e.target.files, pLoading: true }, async function() {
      const formData = new FormData();
      formData.append("pFile", this.state.pFile[0]);

      try {
        await axios.patch(
          `http://127.0.0.1:8000/api/v1/users/${this.props.match.params.id}/updatePImage`,
          formData
        );
        window.location.assign(`/users/${this.props.match.params.id}`);
      } catch (error) {}
    });
  };

  render() {
    if (!this.state.wrongUserId) {
      if (!this.state.redirectToLogin) {
        if (this.state.currentUser) {
          return (
            <div className={classes.Compte}>
              <div className={classes.CompteHead}>
                <Image
                  onClick={
                    this.props.match.params.id === this.state.user_id
                      ? () => this.fileInputRef.current.click()
                      : null
                  }
                  onMouseEnter={this.profileImageOnMouseEnterHandler}
                  onMouseLeave={this.profileImageOnMouseLeaveHandler}
                  style={{
                    overflow: "inherit",
                    height: 150,
                    cursor: this.state.pCursor
                  }}
                  src={this.state.currentUser.photo}
                  size="small"
                  circular
                />
                <input
                  ref={this.fileInputRef}
                  type="file"
                  hidden
                  onChange={this.fileChange}
                />
                <div>
                  <div className={classes.NameAndButton}>
                    <div>{this.state.currentUser.nom}</div>
                    {this.state.user_id !== this.props.match.params.id ? (
                      <Button
                        size="tiny"
                        color={this.state.followBtnClr}
                        loading={this.state.fLoading}
                        onClick={this.handleFollow}
                      >
                        {this.state.followBtnClr !== "grey" ? (
                          <>
                            <Icon name="plus" />
                            Follow
                          </>
                        ) : (
                          <> Following </>
                        )}
                      </Button>
                    ) : null}
                  </div>
                  <div className={classes.UserSubInfo}>
                    <div style={{ marginRight: 40 }}>
                      {`${this.state.currentUser.images.length} `}
                      {this.state.currentUser.images.length === 0 ||
                      this.state.currentUser.images.length === 1
                        ? "post"
                        : "posts"}
                    </div>
                    <div style={{ marginRight: 40 }}>
                      {this.state.abonnes} followers
                    </div>
                    <div>{this.state.abonnements} following</div>
                  </div>
                </div>
              </div>
              <Divider />
              <div className={classes.PostContainer}>
                {this.state.currentUser.images &&
                  this.state.currentUser.images.map(el => (
                    <div
                      key={el.id}
                      style={{
                        background: `url(${el.imgUrl}) 50% 50% no-repeat`
                      }}
                      className={classes.Post}
                    ></div>
                  ))}
              </div>
            </div>
          );
        } else {
          return null;
        }
      } else {
        return <Redirect to="/login" />;
      }
    } else {
      return <NoMatch />;
    }
  }
}

export default Compte;

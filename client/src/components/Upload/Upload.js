import React from "react";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";
import { Dimmer, Loader } from "semantic-ui-react";
import "filepond/dist/filepond.min.css";
import "./Upload.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import Button from "./Button/Button";
import { Redirect } from "react-router-dom";
import ServerError from "../../pages/error/ServerError";
import { TextArea, Form } from "semantic-ui-react";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

class upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      redirect: false,
      loading: false,
      redirectToLogin: false,
      errorMessage: null,
      jwt_token: props.cookies.get("jwt")
        ? props.cookies.get("jwt").split(" ")[0]
        : null,
      user_id: props.cookies.get("jwt")
        ? props.cookies.get("jwt").split(" ")[1]
        : null,
      description: ""
    };
  }

  componentDidMount() {
    if (this.state.jwt_token) {
      this.setState({ redirectToLogin: false });
    } else {
      this.setState({ redirectToLogin: true });
    }
  }

  // This method creates images in the database.
  Post = async e => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    const formData = new FormData();
    let loading;
    let redirect;
    let errorMessage = null;

    formData.append("filepond", this.state.files[0]);

    // This is where to add the id of the user that
    // uploaded the image >> req.body.user
    formData.append("user", [this.state.user_id]);
    formData.append("description", [this.state.description]);

    try {
      const image = await axios.post(
        "http://127.0.0.1:8000/api/v1/images",
        formData
      );

      const user = await axios.get(
        `http://127.0.0.1:8000/api/v1/users/${this.state.user_id}`
      );

      image &&
        (await axios.patch(
          `http://127.0.0.1:8000/api/v1/users/${this.state.user_id}`,
          {
            images: [...user.data.user.images, image.data.image.id]
          }
        ));

      redirect = true;
    } catch (error) {
      loading = false;
      if (error.response.data.message.multerError) {
        errorMessage = error.response.data.message.multerError.error;
      } else if (error.response.data.message.errors.imgUrl) {
        errorMessage = error.response.data.message.errors.imgUrl.message;
      }
    }

    this.setState({
      loading,
      redirect,
      errorMessage
    });
  };

  handleDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  render() {
    if (!this.state.redirectToLogin) {
      if (this.state.redirect) {
        return <Redirect to="/" />;
      }
      return (
        <div>
          <Dimmer active={this.state.loading} inverted>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
          <div className="upload-header">Télécharger une image.</div>
          <Form className="upload-description">
            <TextArea
              onChange={e => this.handleDescription(e)}
              placeholder="Rédigez une description de votre photo.."
              style={{ minHeight: 100, maxHeight: 100 }}
            />
          </Form>
          <div className="upload">
            <div className="upload-main">
              <FilePond
                ref={ref => (this.pond = ref)}
                files={this.state.files}
                allowMultiple={false}
                onupdatefiles={fileItems => {
                  this.setState({
                    files: fileItems.map(fileItem => fileItem.file),
                    errorMessage: false
                  });
                }}
              ></FilePond>
            </div>
            {/* TODO: Add notifications, it's better. */}
            {this.state.errorMessage && (
              <ServerError errorMessage={this.state.errorMessage} />
            )}

            <Button Post={this.Post} name="Télécharger" />
          </div>
        </div>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}

export default upload;

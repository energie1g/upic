import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

export default function withAuth(ComponentToProtect) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        redirect: false,
        token: null
      };
    }

    async componentDidMount() {
      try {
        const res = await axios({
          method: "GET",
          url: "http://127.0.0.1:8000/api/v1/users/checkToken"
        });

        if (res && res.data && res.data.status === "success") {
          this.setState({ loading: false, token: res.data.token });
        } else {
          const error = new Error(res.error);
          throw error;
        }
      } catch (error) {
        this.setState({ loading: false, redirect: true });
      }
    }

    render() {
      //   const { loading, redirect } = this.state;
      //   if (loading) {
      //     return null;
      //   }
      //   if (redirect) {
      //     return <Redirect to="/" />;
      //   }
      return <ComponentToProtect token={this.state.token} {...this.props} />;
    }
  };
}

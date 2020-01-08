import React from "react";
import { Message } from "semantic-ui-react";

export default props => (
  <Message negative>
    <Message.Header>Oops! Une erreur s'est produite.</Message.Header>
    <p>{props.errorMessage}</p>
  </Message>
);

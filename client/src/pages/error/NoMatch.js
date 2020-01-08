import React from "react";
import { Link } from "react-router-dom";
import { Message } from "semantic-ui-react";

export default () => (
  <Message negative>
    <Message.Header>404. Oops! Cette page est introuvable.</Message.Header>
    <p>
      Il semble que rien n'ait été trouvé à ce lien{" "}
      <b>{window.location.pathname}</b>. Essayez peut-être l’un des liens du
      menu ou appuyez en arrière pour revenir à la page précédente.
    </p>
    <Link to="/login">Login</Link> or go <Link to="/">Home</Link>
  </Message>
);

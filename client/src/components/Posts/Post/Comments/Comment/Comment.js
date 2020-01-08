import React from "react";
import { Comment as Comm } from "semantic-ui-react";

export default function(props) {
  return (
    <Comm>
      <Comm.Avatar src={props.photo} style={{ height: 40 }} />
      <Comm.Content>
        <Comm.Author as="a">{props.nom}</Comm.Author>
        <Comm.Metadata>
          <div>{props.date}</div>
        </Comm.Metadata>
        <div style={{ width: 300 }}>
          <Comm.Text>{props.comment}</Comm.Text>
        </div>
        <Comm.Actions>
          <Comm.Action></Comm.Action>
        </Comm.Actions>
      </Comm.Content>
    </Comm>
  );
}

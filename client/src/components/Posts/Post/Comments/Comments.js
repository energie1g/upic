import React from "react";
import { Button, Comment as Comm, Form, Header } from "semantic-ui-react";
import Comment from "./Comment/Comment";

export default function(props) {
  const commentsToRender = props.comments.map((el, ind) => {
    return (
      <Comment
        key={el.data.comment._id}
        nom={el.data.comment.user.nom}
        date={el.data.comment.date}
        comment={el.data.comment.comment}
        photo={el.data.comment.user.photo}
      />
    );
  });

  return (
    <Comm.Group size="large">
      <Header as="h3" dividing></Header>

      {commentsToRender}

      <Form reply>
        <Form.TextArea
          placeholder="Ajouter un commentaire..."
          style={{
            resize: "none",
            height: 40,
            borderTop: "none",
            borderRight: "none",
            borderLeft: "none",
            borderTopWidth: "thin"
          }}
          onChange={props.commentHandler}
          value={props.comment}
        />
        <Button
          content="Comment"
          labelPosition="left"
          icon="edit"
          primary
          disabled={props.btnDisabled}
          onClick={props.postComment}
        />
      </Form>
    </Comm.Group>
  );
}

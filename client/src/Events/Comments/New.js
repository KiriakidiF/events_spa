import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';
import { createComment, fetchEvents } from '../../api';

function CommentsNew() {
  let history = useHistory();
  const [comment, setComment] = useState({body: ""});

  const {id} = useParams();

  function update(field, ev) {
    let e1 = Object.assign({}, comment);
    e1[field] = ev.target.value;
    setComment(e1);
  }

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(comment, ['body']);
    createComment(id, data).then(() => {
        fetchEvents();
        history.push(`/events/${id}`);
    });
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>New Comment:</Form.Label>
            <Form.Control type="text"
                          onChange={(ev) => update("body", ev)}
                          value={comment.body || ""} />
          </Form.Group>
          <Button variant="primary"
                  type="submit">
            Save
          </Button>
        </Form>
      </Col>
    </Row>
  );
}

function state2props() {
  return {};
}

export default connect(state2props)(CommentsNew);
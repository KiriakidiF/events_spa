import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';
import { createInvite, fetchEvents } from '../../api';
import config from '../../config';

function InvitesNew() {
  let history = useHistory();
  const [invite, setInvite] = useState({user_email: ""});

  const {id} = useParams();

  let clientUrl = config.CLIENT_URL;

  function update(field, ev) {
    let e1 = Object.assign({}, invite);
    e1[field] = ev.target.value;
    setInvite(e1);
  }

  let invitedLink = (
    <Alert variant="success">
      Invited users can reply to your event at: {clientUrl}events/{id}
    </Alert>
  );

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(invite, ['user_email']);
    createInvite(id, data).then(() => {
        fetchEvents();
    });
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>New Invitee Email:</Form.Label>
            <Form.Control type="text"
                          onChange={(ev) => update("user_email", ev)}
                          value={invite.user_email || ""} />
          </Form.Group>
          <Button variant="primary"
                  type="submit">
            Save
          </Button>
        </Form>
        {invitedLink}
      </Col>
    </Row>
  );
}

function state2props() {
  return {};
}

export default connect(state2props)(InvitesNew);
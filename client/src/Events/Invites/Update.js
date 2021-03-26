import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';
import { updateInvite, fetchEvents } from '../../api';

function InvitesUpdate({event_id, inv}) {
  let history = useHistory();
  const [invite, setInvite] = useState({user_email: inv.user_email, response: inv.response});

  function update(field, ev) {
    let e1 = Object.assign({}, invite);
    e1[field] = ev.target.value;
    setInvite(e1);
  }

  function onSubmit(ev) {
    ev.preventDefault();

    let data = pick(invite, ["response", "user_email"]);
    console.log("data: " + data)
    updateInvite(event_id, inv.id, data).then(() => {
        fetchEvents();
        history.push(`/events/${event_id}`);
    });
  }

  return (
    <Row>
      <Col>
        <Form onSubmit={onSubmit}>
          <Form.Group>
              <Form.Control as="select"
                onChange={(ev) => update("response", ev)}
                value={invite.response}>
                <option value={invite.response}>{invite.response}</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="Maybe">Maybe</option>
              </Form.Control>
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

export default connect(state2props)(InvitesUpdate);

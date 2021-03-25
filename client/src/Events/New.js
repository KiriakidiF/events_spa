import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useState } from 'react'
import { useHistory } from 'react-router-dom';
import pick from 'lodash/pick';
import { createEvent, fetchEvents } from '../api';

import Flatpickr from 'react-flatpickr';

function EventsNew() {
  let history = useHistory();
  const [event, setEvent] = useState({name: "", date: "", desc: ""});

  function update(field, ev) {
    let e1 = Object.assign({}, event);
    e1[field] = ev.target.value;
    setEvent(e1);
  }

  function updateDate(date) {
    let e1 = Object.assign({}, event);
    e1["date"] = date[0];
    setEvent(e1);
  }

  function onSubmit(ev) {
    ev.preventDefault();
    console.log(event);

    let data = pick(event, ['name','date', 'desc']);
    createEvent(data).then(() => {
        console.log("Create Event resp: " + data);
        fetchEvents();
        history.push("/events");
    });
  }

  return (
    <Row>
      <Col>
        <h2>Create New Event</h2>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text"
                          onChange={(ev) => update("name", ev)}
                          value={event.name || ""} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Flatpickr
                value={event.date || ""}
                onChange={(date) => updateDate(date)}
                options={{enableTime: true}}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control type="text"
                          onChange={(ev) => update("desc", ev)}
                          value={event.desc || ""} />
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

export default connect(state2props)(EventsNew);
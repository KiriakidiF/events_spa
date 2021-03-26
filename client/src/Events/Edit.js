import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import pick from 'lodash/pick';
import { updateEvent, fetchEvents } from '../api';

import Flatpickr from 'react-flatpickr';

function EventsEdit({events}) {
    const {id} = useParams();
    console.log("Event_id: " + id)
    let evt = events?.find((evt) => evt?.id == id)
    console.log(evt)
    let history = useHistory();
    const [event, setEvent] = useState({name: evt?.name, date: evt?.date, desc: evt?.desc});

    if (evt && !event.name) {
        setEvent({name: evt?.name, date: evt?.date, desc: evt?.desc});
    }
    

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
        updateEvent(id, data).then(() => {
            console.log("Edit Event resp: " + data);
            fetchEvents();
            history.push("/events/" + id);
        });
    }

    return (
        <Row>
        <Col>
            <h2>Edit Event</h2>
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
  return (({events}) => ({events}));
}

export default connect(({events}) => ({events}))(EventsEdit);
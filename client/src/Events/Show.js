import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { deleteEvent, fetchEvents } from '../api';
import { useParams, useHistory } from 'react-router-dom';

function EventsShow({events}) {
    let history = useHistory();

    const {id} = useParams();
    let event = events.find(evt => evt.id == id)
    return (
        <div>
            <Row>
                <h2>{event?.name}</h2>
            </Row>
            <Row>
                <p>{event?.desc}</p>
            </Row>
            <Row>
                <p>Date: {event?.date}</p>
            </Row>
            <Row>
                <Button onClick={ () => 
                    {
                        deleteEvent(id).then(() => {
                            fetchEvents();
                            history.push("/events");
                        });
                    } } >Delete</Button>
            </Row>
        </div>
    )
}

export default connect(({events}) => ({events}))(EventsShow);
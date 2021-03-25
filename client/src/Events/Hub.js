import { Row, Col, Card, Nav } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

function Event({event}) {
    return (
        <Col>
            <Card>
                <Card.Body>
                    Name: {event.name}<br />
                    Date: {event.date}<br />
                    Description: {event.desc}<br />
                </Card.Body>
                <Card.Link href={`/events/${event.id}`}>
                    View Event
                </Card.Link>
                <Card.Link>

                </Card.Link>
            </Card>
        </Col>
    );
}

function Hub({events}) {
    let cards = events.map((evt) => <Event event={evt} key={evt.id} />);
    return (
        <Col>
            <Row>
                <h1>Event Hub</h1>
            </Row>
            <Row>
                <Nav.Item>
                    <NavLink to="/events/new">Create New Event</NavLink>
                </Nav.Item>
            </Row>
            <Row>
                { cards }
            </Row>
        </Col>
    );
}

export default connect(({events}) => ({events}))(Hub);
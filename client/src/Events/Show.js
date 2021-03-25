import { connect } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import { deleteEvent, fetchEvents } from '../api';
import { useParams, useHistory } from 'react-router-dom';

function Invite({invite}) {
    console.log(invite?.user_email)
    return (
        <Row>
            <Col>
                <p>Email: {invite?.user_email}</p>
            </Col>
            <Col>
                <p>Response: {invite?.response}</p>
            </Col>
        </Row>
    );
}

function Comment({comment}) {
    console.log(comment?.body)
    return (
        <Row>
            <Col>
                <p>{comment?.body}</p>
            </Col>
            <Col>
                <p>Posted by: {comment?.user?.name}</p>
            </Col>
        </Row>
    );
}

function EventsShow({events}) {
    let history = useHistory();

    const {id} = useParams();
    let event = events.find(evt => evt.id == id);

    if (!event) {
        return (
            <p> You do not have access to this event. </p>
        );
    }

    console.log(event)

    let invites = event?.invites;
    invites = invites?.map((inv) => <Invite invite={inv} key={inv.id}/>);
    let comments = event?.comments;
    comments = comments?.map((cmt) => <Comment comment={cmt} key={cmt.id}/>);

    
    
    return (
        <div>
            <Row>
                <Col>
                    <Row>
                        <h2>{event?.name}</h2>
                    </Row>
                    <Row>
                        <p>{event?.desc}</p>
                    </Row>
                    <Row>
                        <p>Date: {event?.date}</p>
                    </Row>
                </Col>
                
                <Col>
                    <Row>
                        <h3>Invitees</h3>
                    </Row>
                    <Row>
                        { invites }
                    </Row>
                </Col>
            </Row>
            
            <Row>
                <Button onClick={ () => 
                    {
                        if (window.confirm("Delete this Event?")){
                            deleteEvent(id).then(() => {
                                fetchEvents();
                                history.push("/events");
                            });
                        }
                    } } >Delete</Button>
            </Row>
            
            <Row>
                <Col>
                    <Row>
                        <h3>Comments</h3>
                    </Row>
                    <Row>
                        { comments }
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default connect(({events}) => ({events}))(EventsShow);
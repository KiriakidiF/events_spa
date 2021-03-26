import { connect } from 'react-redux';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { deleteEvent, deleteComment, deleteInvite, fetchEvents } from '../api';
import { useParams, useHistory } from 'react-router-dom';
import CommentsNew from './Comments/New';
import InvitesNew from './Invites/New';
import InvitesUpdate from './Invites/Update';

function Invite({session, invite, id, owns_event}) {
    let history = useHistory();
    console.log(invite?.user_email)

    let responseNormal = (
        <p>{invite?.response}</p>
    );

    let responseEdit = (
        <InvitesUpdate event_id={id} inv={invite}/>
    );

    let response = responseNormal;
    if (session?.email == invite.user_email) {
        response = responseEdit;
    }

    let deleteButton = null;
    if (owns_event) {
        deleteButton = (
            <Button onClick={ () => 
                {
                    if (window.confirm("Delete this Invite?")){
                        deleteInvite(id, invite.id).then((_data) => {
                            fetchEvents();
                            history.push(`/events/${id}`);
                        });
                    }
                } } 
            >Delete Invite</Button>
        );
    }


    return (
        <div>   
            <div>
                <Row>
                    <Col>
                        <p>{invite?.user_email}</p>
                    </Col>
                    <Col>
                        {response}
                    </Col>
                    <Col>
                        {deleteButton}
                    </Col>
                </Row>
            </div>
        </div>
    );
}

function Comment({comment, id, owns_event, session}) {
    let history = useHistory();
    console.log(comment);

    let deletecomment = null;
    if (owns_event || session?.user_id == comment.user.id) {
        deletecomment = (
            <Button onClick={ () => 
                {
                    if (window.confirm("Delete this Comment?")){
                        deleteComment(id, comment.id).then((_data) => {
                            fetchEvents();
                            history.push(`/events/${id}`);
                        });
                    }
                } } 
            >Delete Comment</Button>
        );
    }

    return (
        <div>
            <Col>
                <p>{comment?.body}</p>
            </Col>
            <Col>
                <p>Posted by: {comment?.user?.name}</p>
            </Col>
            <Col>
                {deletecomment}
            </Col>
        </div>
    );
}

function InvitesReport({invites}) {
    let counts = invites.reduce(
        (counts, invite) => {
            switch(invite.response) {
                case "Yes":
                    counts[0]++;
                    break;
                case "No":
                    counts[1]++;
                    break
                case "Maybe":
                    counts[2]++;
                    break;
                default:
                    counts[3]++;
            }
            return counts;},
        [0,0,0,0]
        );
    return (
        <p>Yes: {counts[0]} | No: {counts[1]} | Maybe: {counts[2]} | No Response: {counts[3]}</p>
    );
}

function EventsShow({session, events}) {
    let history = useHistory();

    const {id} = useParams();
    let event = events.find(evt => evt.id == id);

    if (!event) {
        return (
            <p> You do not have access to this event. </p>
        );
    }

    console.log(session)

    console.log(event)

    let owns_event = event?.owner?.email == session?.email;

    console.log(owns_event)

    let invites = event?.invites;
    invites = invites?.map((inv) => <Invite session={session} 
                                            invite={inv} 
                                            id={id}
                                            owns_event={owns_event} 
                                            key={inv.id}/>);
    let comments = event?.comments;
    comments = comments?.map((cmt) => <Comment 
                                                comment={cmt}
                                                id={id} 
                                                owns_event={owns_event}
                                                session={session}
                                                key={cmt.id}/>);

    let newinvite = null;

    let deleteevent = null;

    if (owns_event) {
        newinvite = (
            <InvitesNew id/>
        );

        deleteevent = (
            <Button onClick={ () => 
                {
                    if (window.confirm("Delete this Event?")){
                        deleteEvent(id).then((_data) => {
                            fetchEvents();
                            history.push("/events");
                        });
                    }
                } } >Delete Event</Button>
        );
    }
    
    
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
                        <InvitesReport invites={event?.invites}/>
                    </Row>
                    <Row>
                        <Col>
                            <p>Email:</p>
                        </Col>
                        <Col>
                            <p>Response:</p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    { invites }
                    <Row>
                        {newinvite}
                    </Row>
                </Col>
            </Row>
            
            <Row>
                {deleteevent}
            </Row>
            
            <Row>
                <Col>
                    <Row>
                        <h3>Comments</h3>
                    </Row>
                    <Row>
                        <CommentsNew id/>
                    </Row>
                    <Row>
                        <Col>
                            { comments }
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default connect(({session, events}) => ({session, events}))(EventsShow);
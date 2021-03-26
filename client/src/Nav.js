import { Nav, Row, Col, Form,
    Button, Alert } from 'react-bootstrap';
import { NavLink, useLocation, useHistory } from 'react-router-dom';

import { connect } from 'react-redux';
import { useState } from 'react';
import { api_login, fetchEvents } from './api';
import { save_redir } from './api';

function LoginForm() {
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");

    function on_submit(ev) {
        ev.preventDefault();
        api_login(email, pass);
    }

    return (
        <Form onSubmit={on_submit} inline>
            <label>Email:</label>
            <Form.Control
                name="email"
                type="text"
                onChange={(ev) => setEmail(ev.target.value)}
                value={email} />
            <label>Password:</label>
            <Form.Control
                name="password"
                type="password"
                onChange={(ev) => setPass(ev.target.value)}
                value={pass} />
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

let SessionInfo = connect()(({session, dispatch}) => {
    function logout() {
        dispatch({type: 'session/clear'});
        fetchEvents();
    }

    return (
        <p>
            Logged in as {session.name} &nbsp;
            <Button onClick={logout}>Logout</Button>
        </p>
    )
});

function LOI({session}) {
    if (session) {
        return <SessionInfo session={session} />;
    }
    else {
        return <LoginForm />;
    }
}

const LoginOrInfo = connect(
    ({session}) => ({session}))(LOI);

function Link({to, children}) {
    return (
        <Nav.Item>
            <NavLink to={to} exact className="nav-link" activeClassName="active">
                {children}
            </NavLink>
        </Nav.Item>
    );
}

function AppNav({error}) {
    let error_row = null;

    if (error) {
        error_row = (
            <Row>
                <Col>
                    <Alert variant="danger">{error}</Alert>
                </Col>
            </Row>
        )
    }

    const location = useLocation();

    let history = useHistory();

    function redirectRegister() {
        save_redir(location.pathname);
        history.push("/users/new/");
    }

    return (
        <div>
            <Row>
                <Col>
                    <Nav variant="pills">
                        <Link to="/">Hub</Link>
                        <Link to="/users">Users</Link>
                    </Nav>
                </Col>
                <Col>
                    <LoginOrInfo />
                </Col>
                <Col>
                    <Button onClick={() => redirectRegister()}>Register</Button>
                </Col>
            </Row>
            <Row>
                { error_row }
            </Row>
        </div>  
    );
}

export default connect(({error}) => ({error}))(AppNav);
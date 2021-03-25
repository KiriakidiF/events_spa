import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import UsersList from './Users/List';
import AppNav from "./Nav";
import Hub from "./Events/Hub";
import UsersNew from './Users/New';
import EventsNew from './Events/New';
import EventsShow from './Events/Show';
import React, { useEffect } from 'react';




function App() {

  return (
    <Container>
      <AppNav />
      <Route path={["/", "/events"]} exact>
        <Hub />
      </Route>
      <Route path="/events/new" exact strict>
        <EventsNew />
      </Route>
      <Route path="/events/:id(\d+)">
        <EventsShow id/>
      </Route>
      <Route path="/users" exact>
        <UsersList />
      </Route>
      <Route path="/users/new" exact>
        <UsersNew />
      </Route>
    </Container>
  );
}

export default App;

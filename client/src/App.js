import { Container } from 'react-bootstrap';
import { Switch, Route } from 'react-router-dom';

import './App.scss';
import UsersList from './Users/List';
import AppNav from "./Nav";
import Hub from "./Hub";
import UsersNew from './Users/New';
import EventsNew from './Events/New';
import React, { useEffect } from 'react';



function App() {

  return (
    <Container>
      <AppNav />
      <Route path="/" exact>
        <Hub />
      </Route>
      <Route path="/events/new">
        <EventsNew />
      </Route>
      <Route path="/users" exact>
        <UsersList />
      </Route>
      <Route path="/users/new">
        <UsersNew />
      </Route>
    </Container>
  );
}

export default App;

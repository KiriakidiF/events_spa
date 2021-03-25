import { createStore, combineReducers } from 'redux';
import { load_defaults } from './api';

function users(state = [], action) {
    switch (action.type) {
        case 'users/set':
            return action.data;
        default:
            return state;
    }
}

function events(state = [], action) {
    switch (action.type) {
        case 'events/set':
            if (action.data) {
                return action.data;
            }
            else {
                console.log("No Events passed to set")
                return [];
            }
        default:
            return state;
    }
}

function clear_session() {
    localStorage.removeItem("session");
}

function save_session(sess) {
    let session = Object.assign({},
        sess,
        {time: Date.now()});
    localStorage.setItem("session", JSON.stringify(session));
}

function load_session() {
    let session = localStorage.getItem("session");
    if (!session) {
        return null;
    }

    session = JSON.parse(session);
    let age = Date.now() - session.time;
    let hours_ms = 60*60*1000;
    if (age < 24 * hours_ms) {
        return session;
    }
    else {
        return null;
    }
}

function session(state = load_session(), action) {
    switch (action.type) {
        case 'session/set':
            save_session(action.data);
            return action.data;
        case 'session/clear':
            clear_session();
            return null;
        default:
            return state;
    }
}

function error(state = null, action) {
    switch (action.type) {
        case 'error/set':
            return action.data;
        case 'session/set':
            return null;
        default:
            return state;
    }
}

function root_reducer(state, action) {
    let reducer = combineReducers({
        users,
        events,
        session,
        error
    })
    return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;
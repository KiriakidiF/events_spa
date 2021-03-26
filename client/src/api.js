import store from './store';
import config from './config';

let _apiURL = config.SERVER_URL

function set_token(opts) {
    let state = store.getState();
    let token = state?.session?.token;

    if (opts.headers) {
        opts.headers['x-auth'] = token
    }
    else {
        opts.headers = 
            {
                'x-auth': token
            };
    }
    
    return opts;
}

export async function api_get(path) {
    let text = await fetch(_apiURL + path, set_token({}));
    let resp = await text.json();
    return resp.data;
}

export async function api_post(path, data) {
    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    let text = await fetch(_apiURL + path, set_token(opts));
    return await text.json();
}

export async function api_patch(path, data) {
    let opts = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    let text = await fetch(_apiURL + path, set_token(opts));
    return await text.json();
}

export async function api_delete(path) {
    let opts = {
        method: "DELETE"
    }
    let text = await fetch(_apiURL + path, set_token(opts));
    return await text;
}

export async function post_session(path, data) {
    let opts = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    let text = await fetch(_apiURL + path, set_token(opts));
    return await text.json();
}

export function api_login(email, password) {
    api_post("/session",
            {email, password}).then((data) => {
                console.log("login resp", data);
                if (data.session) {
                    let action = {
                        type: 'session/set',
                        data: data.session
                    }
                    store.dispatch(action);
                }
                else if (data.error) {
                    let action = {
                        type: 'error/set',
                        data: data.error
                    }
                    store.dispatch(action);
                }
                fetchEvents();
            });
}

export async function fetchUsers() {
    api_get("/users").then((data) => store.dispatch({
        type: 'users/set',
        data: data,
    }));
}

export function createUser(user) {
    return api_post("/users", {user});
}

export async function fetchEvents() {
    api_get("/events").then((data) => store.dispatch({
            type: "events/set",
            data: data
        }));
}

export function createEvent(event) {
    return api_post("/events", {event});
}

export function deleteEvent(id) {
    return api_delete("/events/" + id);
}

export function createComment(id, comment) {
    return api_post("events/" + id + "/comments", {comment});
}

export function deleteComment(id, comment_id) {
    return api_delete("events/" + id + "/comments/" + comment_id);
}

export function createInvite(id, invite) {
    return api_post("events/" + id + "/invites", {invite});
}

export function deleteInvite(id, invite_id) {
    return api_delete("events/" + id + "/invites/" + invite_id);
}

export function updateInvite(event_id, invite_id, invite) {
    console.log("event_id: " + event_id + " inv_id: " + invite_id + " invite: " + invite)
    return api_patch("events/" + event_id + "/invites/" + invite_id, {invite})
}

export function load_defaults() {
    fetchUsers();
    fetchEvents();
}

export function save_redir(redir) {
    console.log("calliong set redir");
    store.dispatch({
        type: "redirect/set",
        data: redir
    });
}
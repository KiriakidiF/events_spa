import store from './store';

let _apiURL = "http://localhost:4000/api/v1/"

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

export async function api_delete(path) {
    let opts = {
        method: "DELETE"
    }
    let text = await fetch(_apiURL + path, set_token(opts));
    console.log(text)
    return await text;
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
    console.log("fetching events")
    api_get("/events").then((data) => store.dispatch({
            type: "events/set",
            data: data
        }));
}

export function createEvent(event) {
    return api_post("/events", {event});
}

export function deleteEvent(id) {
    console.log("Deleting id: " + id);
    return api_delete("/events/" + id);
}

export function load_defaults() {
    fetchUsers();
    fetchEvents();
}
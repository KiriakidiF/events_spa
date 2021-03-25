import { createStore, combineReducers } from 'redux';

function users(state = [], action) {
    switch (action.type) {
        case 'users/set':
            return action.data
        default:
            return state;
    }
}

function root_reducer(state, action) {
    let reducer = combineReducers({
        users
    })
    return reducer(state, action);
}

let store = createStore(root_reducer);
export default store;
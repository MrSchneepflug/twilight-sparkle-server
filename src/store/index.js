const redux = require("redux");
const rootReducer = require("../reducers");

const initialState = {
  nextClientId: 1,
  clients: []
};

module.exports = redux.createStore(rootReducer, initialState);


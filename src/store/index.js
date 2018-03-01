const redux = require("redux");
const rootReducer = require("../reducers");

module.exports = redux.createStore(rootReducer, []);


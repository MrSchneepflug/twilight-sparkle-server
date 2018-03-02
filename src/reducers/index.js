const Redux = require("redux");
const nextClientId = require("./nextClientId");
const clients = require("./clients");

module.exports = Redux.combineReducers({
  nextClientId,
  clients
});

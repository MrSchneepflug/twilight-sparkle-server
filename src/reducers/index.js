const _ = require("lodash");

function rootReducer(state = [], action) {
  let newState = [...state];
  let client = null;

  switch (action.type) {
    case "INITIALIZE_CLIENT":
      newState.push({
        id: action.id,
        developer: null,
        estimation: null
      });
      break;
    case "REMOVE_CLIENT":
      _.remove(newState, client => client.id === action.id);
      break;
    case "SET_DEVELOPER":
      client = _.find(newState, client => client.id === action.id);
      client.developer = action.developer;
      break;
    case "SET_ESTIMATION":
      client = _.find(newState, client => client.id === action.id);
      client.estimation = action.estimation;
      break;
    default:
      return state;
  }

  return newState;
}

module.exports = rootReducer;

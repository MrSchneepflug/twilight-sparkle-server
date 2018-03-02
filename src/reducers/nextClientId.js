function nextClientId(state = 1, action) {
  switch (action.type) {
    case "INITIALIZE_CLIENT":
      return state + 1;
      break;
    default:
      return state;
  }
}

module.exports = nextClientId;

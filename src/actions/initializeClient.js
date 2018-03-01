function initializeClient(id) {
  return {
    type: "INITIALIZE_CLIENT",
    id
  };
}

module.exports = initializeClient;

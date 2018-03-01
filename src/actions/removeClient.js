function removeClient(id) {
  return {
    type: "REMOVE_CLIENT",
    id
  }
}

module.exports = removeClient;

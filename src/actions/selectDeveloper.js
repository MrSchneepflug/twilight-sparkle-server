function selectDeveloper(id, developer) {
  return {
    type: "SELECT_DEVELOPER",
    id,
    developer
  }
}

module.exports = selectDeveloper;

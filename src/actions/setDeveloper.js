function setDeveloper(id, developer) {
  return {
    type: "SET_DEVELOPER",
    id,
    developer
  }
}

module.exports = setDeveloper;

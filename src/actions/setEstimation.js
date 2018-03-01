function setEstimation(id, estimation) {
  return {
    type: "SET_ESTIMATION",
    id,
    estimation
  }
}

module.exports = setEstimation;

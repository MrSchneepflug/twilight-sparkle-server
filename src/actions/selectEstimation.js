function selectEstimation(id, estimation) {
  return {
    type: "SELECT_ESTIMATION",
    id,
    estimation
  }
}

module.exports = selectEstimation;

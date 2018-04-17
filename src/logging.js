const colors = require("colors/safe");

module.exports = {
  logMessage: function (id, messageObject) {
    const actionMap = {
      initialize: colors.green("initialize"),
      requestState: colors.blue("requestState"),
      selectDeveloper: colors.yellow("selectDeveloper"),
      resetDeveloperSelection: colors.yellow("resetDeveloperSelection"),
      selectEstimation: colors.magenta("selectEstimation"),
      resetEstimations: colors.magenta("resetEstimations")
    };

    const client = colors.white(`client ${id ? `#${id} ` : ""}(${messageObject.origin}):`);
    console.log(`${client} ${actionMap[messageObject.payload.action]}`);
  },
  logCurrentState: function (state) {
    const clients = state.clients;

    const developerList = clients.filter(client => client.developer !== null).map(client => {
      return colors.bold(`${client.developer} ${client.estimation ? `(${client.estimation})` : ""}`);
    }).join(", ");

    console.log(`-- next client-id: ${colors.bold(state.nextClientId)}`);
    console.log(`-- connected clients: ${colors.bold(clients.length)}`);
    console.log(`-- developers: ${developerList.length === 0 ? colors.bold("none") : developerList}`);
    console.log(`-- raw state: ${colors.cyan(JSON.stringify(state))}`);
  }
};

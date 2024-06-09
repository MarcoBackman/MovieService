let config = require("../config.json");

function getServerInfo() {
    return config.server;
}

module.exports = { getServerInfo };
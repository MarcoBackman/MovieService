const express = require("express");
const logger = require("../util/LogManager").getLogger("OpsController");

let router = express.Router();

//example: http://localhost:8085/ops/liveCheck
router.get('/liveCheck', (req, res) => {
    logger.debug("Health check requested");
    res.status(200).json({status: 'Live'});
});

module.exports = router;
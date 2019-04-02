const express = require("express");
const router = express.Router();
const moment = require("moment");
const { ClientId, ApiKey, ApiSecret } = require("../config/cex");

const CEXIO = require("cexio-api-node");
const cexPublic = new CEXIO().rest;
const cexAuth = new CEXIO(ClientId, ApiKey, ApiSecret).rest;

router.get("/api/ticker", (req, res) => {
  const q = req.query;
  const symbol = q.symbol;
  console.log(q);

  cexPublic.ticker(symbol, function(err, data) {
    if (err) return console.error(err);
    console.log("Ticker\n", data);

    res.send(JSON.stringify(data));
  });
});

module.exports = router;

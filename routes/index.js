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

  cexPublic.ticker(symbol, (err, data) => {
    if (err) return console.error(err);
    console.log("Ticker\n", data);
    res.send(data);
  });
});

router.get("/api/historical", (req, res) => {
  const q = req.query;
  const symbol = q.symbol;
  const startDate = q.start;

  getCexPrices_DailyAll(symbol, startDate, data => {
    res.send(data);
  });
});

getCexPrices_Daily100 = (symbol, startDate, callback) => {
  // Calculate the end date. Cannot be greater than yesterday.
  const yesterday = moment().subtract(1, "days").format("YYYYMMDD").toString();
  const startDatePlus100 = moment(startDate).add(99, "days").format("YYYYMMDD").toString();
  const endDate = moment(startDatePlus100) >= moment(yesterday) ? yesterday : startDatePlus100;

  cexAuth.historical_1m(symbol, endDate, (err, historicalData) => {
    if (err) return console.error(err);

    if (historicalData && historicalData.message && historicalData.message == "null") {
      return console.error("CEX.io returned no data. Is the date param valid?");
    }

    const data = JSON.parse(historicalData.data1d)
      .filter(val => {
        // Is the date in the search range?
        const utcSeconds = parseInt(val[0]) * 1000;
        return moment(utcSeconds) >= moment(startDate);
      })
      .map(val => {
        const utcSeconds = parseInt(val[0]) * 1000;
        const m = moment(utcSeconds).format("YYYYMMDD").toString();
        //let t = new Date(utcSeconds).toGMTString();
        return { time: m, open: val[1], high: val[2], low: val[3], close: val[4], volume: val[5] };
      });

    callback(endDate, data);
  });
}

getCexPrices_DailyAll = (symbol, startDate, callback, data = []) => {

  getCexPrices_Daily100(symbol, startDate, (endDate, history) => {

    const concatData = data.concat(history);
    const yesterdayDate = moment().subtract(1, "days").format("YYYYMMDD").toString();
    if (moment(endDate) < moment(yesterdayDate)) {
      const nextStartDate = moment(endDate).add(1, "days").format("YYYYMMDD").toString();
      getCexPrices_DailyAll(symbol, nextStartDate, callback, concatData);
    } else {
      callback(concatData);
    }
  });
}

module.exports = router;
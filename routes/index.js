const express = require("express");
const router = express.Router();
const moment = require("moment");
const { ClientId, ApiKey, ApiSecret } = require("../config/cex");

const CEXIO = require("cexio-api-node");
const cexPublic = new CEXIO().rest;
const cexAuth = new CEXIO(ClientId, ApiKey, ApiSecret).rest;

router.get("/api/ticker", (req, res) => {
  let q = req.query;
  let symbol = q.symbol;
  console.log(q);

  cexPublic.ticker(symbol, function(err, data) {
    if (err) return console.error(err);
    console.log("Ticker\n", data);
    res.send(data);
  });
});

router.get("/api/historical", (req, res) => {
  debugger;
  const q = req.query;
  const symbol = q.symbol;
  const startDate = q.start;
  console.log(q);

  getCexPrices_DailyAll(symbol, startDate, data => {
    debugger;
    res.send(data);
  });
});

function getCexPrices_Daily100(symbol, startDate, callback) {
  // Calculate the end date. Cannot be greater than yesterday.
  let yesterday = moment()
    .subtract(1, "days")
    .format("YYYYMMDD")
    .toString();
  let startDatePlus100 = moment(startDate)
    .add(99, "days")
    .format("YYYYMMDD")
    .toString();
  let endDate =
    moment(startDatePlus100) >= moment(yesterday)
      ? yesterday
      : startDatePlus100;

  cexAuth.historical_1m(symbol, endDate, (err, historicalData) => {
    if (err) return console.error(err);
    if (
      historicalData &&
      historicalData.message &&
      historicalData.message == "null"
    )
      return console.error("CEX.io returned no data. Is the date param valid?");

    let data = JSON.parse(historicalData.data1d)
      .filter(val => {
        let utcSeconds = parseInt(val[0]) * 1000;
        let isDateInSearchRange = moment(utcSeconds) >= moment(startDate);
        return isDateInSearchRange;
      })
      .map(val => {
        let utcSeconds = parseInt(val[0]) * 1000;
        let m = moment(utcSeconds)
          .format("YYYYMMDD")
          .toString();
        //let t = new Date(utcSeconds).toGMTString();
        return {
          time: m,
          open: val[1],
          high: val[2],
          low: val[3],
          close: val[4],
          volume: val[5]
        };
      });

    callback(endDate, data);
  });
}

function getCexPrices_DailyAll(symbol, startDate, callback, data = []) {
  getCexPrices_Daily100(symbol, startDate, (endDate, history) => {
    let concatData = data.concat(history);

    let yesterdayDate = moment()
      .subtract(1, "days")
      .format("YYYYMMDD")
      .toString();
    if (moment(endDate) < moment(yesterdayDate)) {
      let nextStartDate = moment(endDate)
        .add(1, "days")
        .format("YYYYMMDD")
        .toString();
      getCexPrices_DailyAll(symbol, nextStartDate, callback, concatData);
    } else {
      callback(concatData);
    }
  });
}

module.exports = router;

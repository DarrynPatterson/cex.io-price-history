import React, { Component } from "react";
import "./App.css";
import StockChart from "./StockChart";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cexTickerData: {},
      cexHistory: [],
      symbol: "BTC/USD",
      start: "20190101"
    };
  }

  componentDidMount() {
    fetch(`/api/ticker?symbol=${this.state.symbol}`)
      .then(response => response.json())
      .then(data => {
        this.setState({ cexTickerData: data });
      })
      .catch(error => () => {
        console.log("Cex ticker fetch error");
      });
  }

  getSeriesData() {
    const ohlcv = this.state.cexHistory.map(r => {
      return [r.time, r.close];
    });

    let results = [];
    results[0] = { name: `${this.state.symbol} Price`, data: ohlcv };

    return results;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            {this.state.symbol} Price = {this.state.cexTickerData.last}
          </h1>
          <p>
            <button
              className="button is-medium is-link"
              onClick={() => {
                fetch(
                  "/api/historical?symbol=" +
                    this.state.symbol +
                    "&start=" +
                    this.state.start
                )
                  .then(response => response.json())
                  .then(data => {
                    console.log(data);
                    this.setState({ cexHistory: data });
                  })
                  .catch(error => () => {
                    console.log("Cex history fetch error");
                  });
              }}
            >
              <strong className="has-text-weight-semibold">Create Chart</strong>
            </button>
          </p>
          <br />
          <StockChart
            title="CEX.IO Historical Price Chart"
            data={this.getSeriesData()}
          />
        </header>
      </div>
    );
  }
}

export default App;

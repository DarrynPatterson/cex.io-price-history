import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

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
        </header>
      </div>
    );
  }
}

export default App;

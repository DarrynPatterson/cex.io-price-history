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
      start: "20180701"
    };
  }

  componentDidMount() {
    const symbol = this.state.symbol;
    fetch("/api/ticker?symbol=" + symbol)
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
          <p />
        </header>
      </div>
    );
  }
}

export default App;

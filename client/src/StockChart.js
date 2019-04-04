import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class StockChart extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <HighchartsReact
        highcharts={Highcharts}
        options={{
          title: { text: this.props.title },
          series: this.props.data
        }}
      />
    );
  }
}

export default StockChart;

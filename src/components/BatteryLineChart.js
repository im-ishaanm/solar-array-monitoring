import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function BatteryLineChart({ chartData }) {
  return (
    <div className="BatteryLineChart">
      <p style={{ fontSize: "24px", marginLeft: "24px", marginBottom: "-8px" }}>Energy Storage</p>
      <Line data={chartData} />
    </div>
  );
}

export default BatteryLineChart;

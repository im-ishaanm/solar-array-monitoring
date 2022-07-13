import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function SolarPanelLineChart({ chartData }) {
  return (
    <div className="SolarPanelLineChart">
      <p style={{ fontSize: "24px", marginLeft: "24px", marginBottom: "12px" }}>
        Solar Panel
      </p>
      <Line data={chartData} />
    </div>
  );
}

export default SolarPanelLineChart;

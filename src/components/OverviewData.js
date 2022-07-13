import { React, useState, useEffect } from "react";

import "../css/Card.css";
import "../css/App.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function OverviewData({ data }) {
  let solarSum = 0,
    batterySum = 0;

  const [solarPowerAvg, setSolarPowerAvg] = useState(0);
  const [batteryPowerAvg, setBatteryPowerAvg] = useState(0);

  const [timeAverage, setTimeAverage] = useState(0);
  const [timeAverageUnit, setTimeAverageUnit] = useState("seconds");

  const [maxPower, setMaxPower] = useState(0);
  const [maxBatteryPower, setMaxBatteryPower] = useState(0);
  const [batteryMode, setBatteryMode] = useState("Unknown");
  const [donutData, setDonutData] = useState({
    labels: ["Awaiting more data"],
    datasets: [
      {
        data: [100],
        backgroundColor: ["rgb(255, 99, 132)"],
      },
    ],
  });

  useEffect(() => {
    // console.log("Rendered overview with ", data);
    setMaxPower(Math.max(...data.map((o) => o.solar_panel_power)));
    setMaxBatteryPower(Math.max(...data.map((o) => o.battery_power)));

    var totalSolarPower = 0;
    var totalBatteryPower = 0;
    var totalSeconds = 0;

    for (let i = 1, j = 0; i < data.length; i++) {
      let prevTime = new Date("2022-07-06 " + data[i].date_time.split(" ")[3]);
      let currTime = new Date(
        "2022-07-06 " + data[i - 1].date_time.split(" ")[3]
      );
      totalSeconds += (currTime - prevTime) / 1000;
      totalBatteryPower += parseFloat(data[j].battery_power);
      totalSolarPower += parseFloat(data[j].solar_panel_power);
      j += 1;
    }
    setTimeAverage(totalSeconds / data.length);
    setSolarPowerAvg(totalSolarPower / data.length);
    setBatteryPowerAvg(totalBatteryPower / data.length);

    if (data.length > 1) {
      let currVoltage = data[0].battery_power;
      let prevVoltage = data[1].battery_power;
      // console.log(prevVoltage, currVoltage);
      if (currVoltage - prevVoltage < 0) {
        setBatteryMode("Discharging");
      } else {
        setBatteryMode("Charging");
      }
    }
    if (data.length > 1) {
      data.map((o) => {
        solarSum += parseFloat(o.solar_panel_power);
        batterySum += parseFloat(o.battery_power);
      });

      // console.log("Total Powers: ", solarSum, batterySum);

      setDonutData({
        labels: [
          "Power generated by Solar Panels (W)",
          "Power consumed by the Load (W)",
        ],
        datasets: [
          {
            data: [solarSum, batterySum],
            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="overview-data-container">
      <div className="donut-chart">
        <Doughnut data={donutData} />
        <p style={{ textAlign: "center" }}>
          From{" "}
          <span style={{ fontWeight: "bold" }}>
            {data[data.length - 1].date_time}
          </span>{" "}
          to <span style={{ fontWeight: "bold" }}>{data[0].date_time}</span>
        </p>
      </div>
      <div className="overview-values">
        <div
          style={{
            backgroundColor: "#ddd",
            borderColor: batteryMode === "Charging" ? "green" : "red",
          }}
          className="data-value"
        >
          <h4 style={{ marginBottom: "-28px" }}>Battery Status</h4>
          <p
            className={
              batteryMode === "Charging" ? "status-good" : "status-bad"
            }
            style={{ textTransform: "uppercase", fontWeight: "bolder" }}
          >
            {batteryMode}
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Max Power - <span style={{ fontWeight: "bold" }}>Solar Panels</span>
          </h4>
          <p style={{ textTransform: "uppercase", fontWeight: "bolder" }}>
            {maxPower} W
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Max Power -{" "}
            <span style={{ fontWeight: "bold" }}>Energy Storage</span>
          </h4>
          <p style={{ textTransform: "uppercase", fontWeight: "bolder" }}>
            {maxBatteryPower} W
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Average time between readings
          </h4>
          <p style={{ fontWeight: "bolder" }}>
            {timeAverage.toFixed(0)} {timeAverageUnit}
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Average Power -{" "}
            <span style={{ fontWeight: "bold" }}>Solar Panels</span>
          </h4>
          <p style={{ fontWeight: "bolder" }}>{solarPowerAvg.toFixed(2)} W</p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Average Power -{" "}
            <span style={{ fontWeight: "bold" }}>Energy Storage</span>
          </h4>
          <p style={{ fontWeight: "bolder" }}>{batteryPowerAvg.toFixed(2)} W</p>
        </div>
      </div>
    </div>
  );
}

export default OverviewData;

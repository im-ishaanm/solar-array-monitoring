import { React, useState, useEffect } from "react";

import "../css/Card.css";
import "../css/App.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function OverviewData({ data }) {
  let solarSum = 0,
    batterySum = 0;

  const [samplingValue, setSamplingValue] = useState("Power");
  const [samplingValueUnit, setSamplingValueUnit] = useState("A");

  const [solarPowerAvg, setSolarPowerAvg] = useState(0);
  const [batteryPowerAvg, setBatteryPowerAvg] = useState(0);
  const [solarVoltageAvg, setSolarVoltageAvg] = useState(0);
  const [batteryVoltageAvg, setBatteryVoltageAvg] = useState(0);
  const [solarCurrentAvg, setSolarCurrentAvg] = useState(0);
  const [batteryCurrentAvg, setBatteryCurrentAvg] = useState(0);

  const [timeAverage, setTimeAverage] = useState(0);
  const [timeAverageUnit, setTimeAverageUnit] = useState("seconds");

  const [maxVoltage, setMaxVoltage] = useState(0);
  const [maxBatteryVoltage, setMaxBatteryVoltage] = useState(0);
  const [maxCurrent, setMaxCurrent] = useState(0);
  const [maxBatteryCurrent, setMaxBatteryCurrent] = useState(0);
  const [maxPower, setMaxPower] = useState(0);
  const [maxBatteryPower, setMaxBatteryPower] = useState(0);
  const [batteryMode, setBatteryMode] = useState("Unknown");

  const [maxData1, setMaxData1] = useState(maxPower);
  const [maxData2, setMaxData2] = useState(maxBatteryPower);
  const [avgData1, setAvgData1] = useState(solarPowerAvg);
  const [avgData2, setAvgData2] = useState(batteryPowerAvg);

  const [donutData, setDonutData] = useState({
    labels: ["Awaiting more data"],
    datasets: [
      {
        data: [100],
        backgroundColor: ["rgb(255, 99, 132)"],
      },
    ],
  });

  const changeOverviewData = (mdata1, mdata2, adata1, adata2) => {
    setMaxData1(mdata1);
    setMaxData2(mdata2);
    setAvgData1(adata1);
    setAvgData2(adata2);
  };

  const cycleOverview = (val) => {
    if (val == "Voltage") {
      changeOverviewData(
        maxVoltage,
        maxBatteryVoltage,
        solarVoltageAvg,
        batteryVoltageAvg
      );
      setSamplingValueUnit("V");
    } else if (val == "Current") {
      changeOverviewData(
        maxCurrent,
        maxBatteryCurrent,
        solarCurrentAvg,
        batteryCurrentAvg
      );
      setSamplingValueUnit("A");
    } else {
      changeOverviewData(
        maxPower,
        maxBatteryPower,
        solarPowerAvg,
        batteryPowerAvg
      );
      setSamplingValueUnit("W");
    }
  };

  const handleSamplingChange = (e) => {
    setSamplingValue(e.target.value);
    cycleOverview(e.target.value);
  };

  useEffect(() => {
    cycleOverview(samplingValue);
  }, [batteryPowerAvg]);

  useEffect(() => {
    // console.log("Rendered overview with ", data);
    setMaxPower(Math.max(...data.map((o) => o.solar_panel_power)));
    setMaxBatteryPower(Math.max(...data.map((o) => o.battery_power)));

    setMaxVoltage(Math.max(...data.map((o) => o.solar_panel_voltage)));
    setMaxBatteryVoltage(Math.max(...data.map((o) => o.battery_voltage)));

    setMaxCurrent(Math.max(...data.map((o) => o.solar_panel_current)));
    setMaxBatteryCurrent(Math.max(...data.map((o) => o.battery_current)));

    var totalSolarPower = 0;
    var totalBatteryPower = 0;
    var totalSeconds = 0;
    var totalSolarVoltage = 0;
    var totalBatteryVoltage = 0;
    var totalSolarCurrent = 0;
    var totalBatteryCurrent = 0;

    for (let i = 1, j = 0; i < data.length; i++) {
      let prevTime = new Date("2022-07-06 " + data[i].date_time.split(" ")[3]);
      let currTime = new Date(
        "2022-07-06 " + data[i - 1].date_time.split(" ")[3]
      );
      totalSeconds += (currTime - prevTime) / 1000;

      totalBatteryPower += parseFloat(data[j].battery_power);
      totalSolarPower += parseFloat(data[j].solar_panel_power);

      totalBatteryVoltage += parseFloat(data[j].battery_voltage);
      totalSolarVoltage += parseFloat(data[j].solar_panel_voltage);

      totalBatteryCurrent += parseFloat(data[j].battery_current);
      totalSolarCurrent += parseFloat(data[j].solar_panel_current);
      j += 1;
    }
    if (totalSeconds < 0) {
      totalSeconds = totalSeconds * -1;
    }
    setTimeAverage(totalSeconds / data.length);

    setSolarPowerAvg(totalSolarPower / data.length);
    setBatteryPowerAvg(totalBatteryPower / data.length);

    setSolarVoltageAvg(totalSolarVoltage / data.length);
    setBatteryVoltageAvg(totalBatteryVoltage / data.length);

    setSolarCurrentAvg(totalSolarCurrent / data.length);
    setBatteryCurrentAvg(totalBatteryCurrent / data.length);

    if (data.length > 1) {
      let currVoltage = data[0].battery_power;
      let prevVoltage = data[1].battery_power;
      // console.log(prevVoltage, currVoltage);
      if (data[0].solar_panel_current <= 0) {
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
        <p
          style={{
            fontSize: "15px",
            textAlign: "center",
            marginTop: "32px",
          }}
        >
          From{" "}
          <span style={{ fontWeight: "bold" }}>
            {data[data.length - 1].date_time}
          </span>{" "}
          to <span style={{ fontWeight: "bold" }}>{data[0].date_time}</span>
        </p>
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            padding: "0",
            marginBottom: "0",
          }}
          className="sampling-selector"
        >
          <label>Overview Data</label>
          <select value={samplingValue} onChange={handleSamplingChange}>
            <option value="Power">Power</option>
            <option value="Voltage">Voltage</option>
            <option value="Current">Current</option>
          </select>
        </div>
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
            Max {samplingValue} -{" "}
            <span style={{ fontWeight: "bold" }}>Solar Panels</span>
          </h4>
          <p style={{ textTransform: "uppercase", fontWeight: "bolder" }}>
            {maxData1} {samplingValueUnit}
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Max {samplingValue} -{" "}
            <span style={{ fontWeight: "bold" }}>Energy Storage</span>
          </h4>
          <p style={{ textTransform: "uppercase", fontWeight: "bolder" }}>
            {maxData2} {samplingValueUnit}
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
            Average {samplingValue} -{" "}
            <span style={{ fontWeight: "bold" }}>Solar Panels</span>
          </h4>
          <p style={{ fontWeight: "bolder" }}>
            {avgData1.toFixed(2)} {samplingValueUnit}
          </p>
        </div>
        <div className="data-value">
          <h4 style={{ marginBottom: "-28px" }}>
            Average {samplingValue} -{" "}
            <span style={{ fontWeight: "bold" }}>Energy Storage</span>
          </h4>
          <p style={{ fontWeight: "bolder" }}>
            {avgData2.toFixed(2)} {samplingValueUnit}
          </p>
        </div>
      </div>
    </div>
  );
}

export default OverviewData;

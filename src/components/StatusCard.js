import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";

function StatusCard({ data }) {
  const [voltage, setVoltage] = useState(data.solar_panel_voltage);
  const [current, setCurrent] = useState(data.solar_panel_current);
  const [power, setPower] = useState(data.solar_panel_power);
  const [batteryCurrent, setBatteryCurrent] = useState(data.battery_current);
  const [batteryVoltage, setBatteryVoltage] = useState(data.battery_voltage);
  const [batteryPower, setbatteryPower] = useState(data.battery_power);

  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("Unrecognized");
  const [environmentColor, setEnvironmentColor] = useState("black");
  const [lux, setLux] = useState(data.lux);
  const [datetime, setDateTime] = useState(data.date_time);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Unknown");

  useEffect(() => {
    if (status === "Optimal" && lux >= 300) {
      setDescription(
        "Panels are running at optimal condition and is recieving adequate light level."
      );
    } else if (status === "Non-Optimal" && lux >= 300) {
      setDescription(
        "ERROR: Panels are non-optimal despite adequate lighting. Panel check-up required."
      );
    } else if (status === "Non-Optimal" && lux < 300) {
      setDescription(
        "Panels are non-optimal due to inadequate level of lighting."
      );
    } else if (status === "Optimal" && lux < 300) {
      setDescription(
        "ERROR: Panels are running at optimal condition but is recieving inadequate lighting. Light sensor check-up required."
      );
      console.log("Changing description to: ", description, lux, status);
    }
  }, [environment, voltage]);

  useEffect(() => {
    if (lux <= 10) {
      setEnvironment("Low Light Level (Night)");
      setEnvironmentColor("#14213d");
    } else if (lux > 10 && lux <= 200) {
      setEnvironment("Low Light Level (Indoor)");
      setEnvironmentColor("#023e8a");
    } else if (lux > 200 && lux <= 700) {
      setEnvironment("Moderate Light Level (Indoor)");
      setEnvironmentColor("#0077b6");
    } else if (lux > 700 && lux <= 1100) {
      setEnvironment("Moderate Light Level (Cloudy)");
      setEnvironmentColor("#001d3d");
    } else {
      setEnvironment("Adequate Light Level (Sunny)");
      setEnvironmentColor("#ffd60a");
    }
  }, [lux]);

  useEffect(() => {
    updateData();
  }, [data.date_time]);

  useEffect(() => {
    // console.log("data changed");
    updateData();
  }, [
    data.solar_panel_voltage,
    data.lux,
    data.solar_panel_current,
    data.solar_panel_power,
    data.battery_power,
  ]);

  useEffect(() => {
    // console.log("state date changed");
    formatDateTime();
  }, [datetime]);

  useEffect(() => {
    //console.log("state voltage changed");
    updateStatus();
  }, [voltage]);

  const updateData = () => {
    setCurrent(data.solar_panel_current);
    setLux(data.lux);
    setVoltage(data.solar_panel_voltage);
    setDateTime(data.date_time);
    setPower(data.solar_panel_power);
    setBatteryCurrent(data.battery_current);
    setBatteryVoltage(data.battery_voltage);
    setbatteryPower(data.battery_power);
  };

  const formatDateTime = () => {
    if (datetime) {
      const datetime_array = datetime.split(" ");
      //console.log(datetime_array);
      const date_string =
        datetime_array[0] + "-" + datetime_array[1] + "-" + datetime_array[2];
      const time_string = datetime_array[3];
      setDate(date_string);
      setTime(time_string);
      //setDate(date_data);
      //setTime(time_data);
    }
  };

  const updateStatus = () => {
    //console.log("Changing status", voltage);
    const pow = parseFloat(voltage);
    if (pow < 4) {
      setStatus("Non-Optimal");
    } else {
      setStatus("Optimal");
    }
  };

  return (
    <div className="StatusCard">
      <h2>
        <span>
          <span style={{ color: environmentColor }}>{environment}</span>
        </span>
      </h2>
      <p id="updated">
        Last updated: {time} | {date}
      </p>
      <p style={{ fontSize: "1em", marginBottom: "-4px" }} id="updated">
        {description}
      </p>
      <hr />
      <div className="data-table">
        <div className="solar-panel-status">
          <h3 className="data-title">Solar Panels</h3>
          <div className="data-value-container">
            <div className="data-value">
              <h4>Voltage</h4>
              <p>{voltage} V</p>
            </div>
            <div className="data-value">
              <h4>Current</h4>
              <p>{current} A</p>
            </div>
            <div className="data-value">
              <h4>Power</h4>
              <p>{power} W</p>
            </div>
            <div className="data-value">
              <h4>Light Level</h4>
              <p>{lux} lux</p>
            </div>
          </div>
        </div>
        <div className="battery-status">
          <h3 className="data-title">Energy Storage</h3>
          <div className="data-value-container">
            <div className="data-value">
              <h4>Voltage</h4>
              <p>{batteryVoltage} V</p>
            </div>
            <div className="data-value">
              <h4>Current</h4>
              <p>{batteryCurrent} A</p>
            </div>
            <div className="data-value">
              <h4>Power</h4>
              <p>{batteryPower} W</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

export default StatusCard;

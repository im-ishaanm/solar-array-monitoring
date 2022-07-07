import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";

function StatusCard({ data }) {
  const [voltage, setVoltage] = useState(data.voltage);
  const [current, setCurrent] = useState(data.current);
  const [lux, setLux] = useState(data.lux);

  const [datetime, setDateTime] = useState(data.date_time);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Unknown");

  useEffect(() => {
    console.log("time changed");
    updateData();
  }, [data.date_time]);

  useEffect(() => {
    console.log("voltage changed");
    updateData();
  }, [data.voltage, data.lux, data.current]);

  useEffect(() => {
    console.log("state date changed");
    formatDateTime();
  }, [datetime]);

  useEffect(() => {
    console.log("state voltage changed");
    updateStatus();
  }, [voltage]);

  const updateData = () => {
    setCurrent(data.current);
    setLux(data.lux);
    setVoltage(data.voltage);
    setDateTime(data.date_time);
  };

  const formatDateTime = () => {
    if (datetime) {
      const time_data = datetime.split(" ")[1];
      const date_data = datetime.split(" ")[0].split("-").reverse().join("-");
      setDate(date_data);
      setTime(time_data);
    }
  };

  const updateStatus = () => {
    console.log("Changing status", voltage);
    const volt = parseFloat(voltage);
    if (volt < 5) {
      setStatus("Non-Optimal");
    } else {
      setStatus("Optimal");
    }
  };

  return (
    <div className="StatusCard">
      <h2>
        Status:{" "}
        <span className={status === "Optimal" ? "status-good" : "status-bad"}>
          {status}
        </span>
      </h2>
      <p id="updated">
        Last updated: {time} | {date}
      </p>
      <hr />
      <div className="solar-panel-status">
        <h3>Solar Panels</h3>
        <p>Voltage: {voltage} V</p>
        <p>Current: {current} A</p>
        <p>Light Level: {lux} lux</p>
      </div>
      <div className="battery-status">
        <h3>Energy Storage</h3>
        <p>Voltage: </p>
        <p>Current: </p>
      </div>
      <hr />
    </div>
  );
}

export default StatusCard;

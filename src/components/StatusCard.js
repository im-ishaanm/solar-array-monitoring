import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";

function StatusCard({ data }) {
  const [voltage, setVoltage] = useState(data.voltage);
  // const [current, setCurrent] = useState(data.current);
  const [datetime, setDateTime] = useState(data.date_time);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("Unknown");

  useEffect(() => {
    console.log("time updated", data.date_time);
    formatDateTime();
  }, [data.date_time]);

  useEffect(() => {
    console.log("voltage changed");
    formatDateTime();
    updateData();
  }, [data.voltage]);

  useEffect(() => {
    console.log("state voltage changed");
    updateStatus();
  }, [voltage]);

  const updateData = () => {
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
    if (volt < 4) {
      setStatus("Non-Optimal");
    } else {
      setStatus("Optimal");
    }
  };

  return (
    <div className="StatusCard">
      <h2>
        Status{" "}
        <span className={status === "Optimal" ? "status-good" : "status-bad"}>
          {status}
        </span>
      </h2>
      <p id="updated">
        Last updated: {time} | {date}
      </p>
      <hr />
      <p>Voltage: {voltage} V</p>
      {/* <p>Current: </p>
      <p>Light Level: </p> */}
    </div>
  );
}

export default StatusCard;

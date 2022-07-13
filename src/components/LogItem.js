import "../css/Card.css";
import "../css/App.css";

import { useState, useEffect } from "react";

function LogItem({ data }) {
  const [datetime, setDateTime] = useState("Fetching date/time...");
  const [highlighted, setHighlighted] = useState(false);

  useEffect(() => {
    const datetime_array = data.date_time.split(" ");
    const datetime_string =
      datetime_array[0] +
      "-" +
      datetime_array[1] +
      "-" +
      datetime_array[2] +
      "; " +
      datetime_array[3];
    setDateTime(datetime_string);
  }, [data]);

  const handleHighlight = () => {
    setHighlighted(!highlighted);
  };

  return (
    <div
      style={{
        background: highlighted ? "#ccc" : "#eee",
      }}
      onClick={() => handleHighlight()}
      className="LogItem"
    >
      <h3 className="item-bar">
        <span className="item-bar-date">{datetime}</span>
        <br />
        <span className="item-bar-solar">
          <span style={{ fontWeight: "bolder" }}>Panels: </span>{" "}
          {data.solar_panel_voltage} V, {data.solar_panel_current} A,{" "}
          {data.solar_panel_power} W, {data.lux} lux
        </span>
        <br />
        <span className="item-bar-battery">
          <span style={{ fontWeight: "bolder" }}>Battery: </span>
          {data.battery_voltage} V, {data.battery_current} A,{" "}
          {data.battery_power} W
        </span>
      </h3>
    </div>
  );
}

export default LogItem;

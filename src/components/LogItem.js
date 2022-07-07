import "../css/Card.css";
import "../css/App.css";

import { useState } from "react";

function LogItem({ data }) {
  return (
    <div className="LogItem">
      <h3 className="item-bar">
        <span className="item-bar-date">
          {" "}
          {">>"} {data.date_time} |
        </span>{" "}
        {data.voltage} V
      </h3>
    </div>
  );
}

export default LogItem;

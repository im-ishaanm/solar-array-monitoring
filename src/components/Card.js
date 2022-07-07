import "../css/Card.css";

import { useState } from "react";

function Card({ data }) {
  const [time, setTime] = useState(data.date_time);
  const [voltage, setVoltage] = useState(data.voltage);

  return (
    <div className={data.obj_index === 0 ? "MainCard" : "Card"}>
      <p>
        <span>Voltage:</span> {voltage} V
      </p>
      <p>
        <span>Date & Time:</span> {time}
      </p>
      {/* <p>
        <span>Power:</span> {data.power} W
      </p> */}
    </div>
  );
}

export default Card;

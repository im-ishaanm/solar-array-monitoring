import "../css/Card.css";
import "../css/App.css";

import LogItem from "./LogItem";

import { useState, useEffect } from "react";

function LogCard({ data }) {
  useEffect(() => {
    setDataArray(data);
  }, [data]);

  const [data_array, setDataArray] = useState(data);

  return (
    <div className="LogCard">
      <h2>Data Log</h2>
      <p className="log-total-entries">
        Number of Entries: {data_array.length}
      </p>
      <div className="log-list">
        {data_array.map((d) => {
          return <LogItem key={d.date_time} data={d} />;
        })}
      </div>
    </div>
  );
}

export default LogCard;

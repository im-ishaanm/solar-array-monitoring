import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import "./css/App.css";

import StatusCard from "./components/StatusCard";
import LogCard from "./components/LogCard";

import { db } from "./util/firebase";

function App() {
  const [solardata, setSolarData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      onValue(ref(db), (snapshot) => {
        const fetched = snapshot.val();
        setLoading(false);
        console.log("FETCHED: ", fetched);
        if (fetched) {
          const temp = Object.values(fetched.test);
          const data = temp
            .sort((a, b) => {
              const time1 = a.date_time.split(" ")[1];
              const time2 = b.date_time.split(" ")[1];
              return time1.localeCompare(time2);
            })
            .reverse();
          setSolarData(
            data.map((doc) => ({
              ...doc,
              power: doc.voltage * doc.current,
            }))
          );
        }
      });
    };
    getData();
  }, []);

  console.log(solardata);

  const handleClick = () => {
    var current = new Date();
    var v = Math.floor(Math.random() * 100);

    const obj = {
      lux: Math.floor(Math.random() * 100),
      current: Math.floor(Math.random() * 10),
      voltage: Math.floor(Math.random() * 100),
      date_time:
        "2022-07-07" +
        " " +
        current.toLocaleTimeString("en-IT", { hour12: false }),
    };

    const id = Math.floor(Math.random() * 1000);
    set(ref(db, `/test/${id}`), obj);
    console.log(obj);
  };

  return (
    <div className="App">
      <h1 className="title-header">Dashboard</h1>
      <button style={{ marginBottom: 12 + "px" }} onClick={() => handleClick()}>
        Add Data
      </button>
      <div className="grid-wrapper">
        {solardata.length > 0 ? (
          <StatusCard data={solardata[0]} />
        ) : (
          <p>{loading ? "Fetching Data..." : "No data found "}</p>
        )}
        {solardata.length > 0 ? <LogCard data={solardata} /> : ""}
      </div>
    </div>
  );
}

export default App;

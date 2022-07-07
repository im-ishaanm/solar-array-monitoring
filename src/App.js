import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import "./css/App.css";

import "@progress/kendo-theme-material/dist/all.css";
import "hammerjs";

import Card from "./components/Card";
import StatusCard from "./components/StatusCard";
import LogCard from "./components/LogCard";

import { db } from "./firebase";

function App() {
  const [solardata, setSolarData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      onValue(ref(db), (snapshot) => {
        const fetched = snapshot.val();
        const temp = Object.values(fetched.test);
        const data = temp.reverse();
        console.log(data);
        setSolarData(
          data.map((doc, index) => ({
            ...doc,
          }))
        );
      });
    };
    getData();
  }, []);

  return (
    <div className="App">
      <h2 className="title-header">Dashboard</h2>
      <div className="grid-wrapper">
        {solardata.length > 0 ? (
          <StatusCard data={solardata[0]} />
        ) : (
          "Loading..."
        )}
        {solardata.length > 0 ? <LogCard data={solardata} /> : ""}
      </div>
      {/* <h1>Dashboard</h1>
      {solardata.map((data) => {
        return <Card key={data.id} data={data} />;
      })} */}
    </div>
  );
}

export default App;

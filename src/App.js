import { onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import "./css/App.css";

import StatusCard from "./components/StatusCard";
import LogCard from "./components/LogCard";
import SolarPanelLineChart from "./components/SolarPanelLineChart";
import BatteryLineChart from "./components/BatteryLineChart";

import { db } from "./util/firebase";

function App() {
  const [solardata, setSolarData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nthElement, setNthElement] = useState(1);
  const [samplingValue, setSamplingValue] = useState("High");
  const [solarLineData, setSolarLineData] = useState({
    labels: [],
    datasets: [],
  });
  const [batteryLineData, setBatteryLineData] = useState({
    labels: [],
    datasets: [],
  });

  const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

  useEffect(() => {
    console.log(solardata);
    let solardata_copy = solardata.slice().reverse();

    solardata_copy = every_nth(solardata_copy, nthElement);

    setBatteryLineData({
      labels: solardata_copy.map((data) => data.date_time.split(" ")[3]),
      datasets: [
        {
          label: "Voltage (V)",
          data: solardata_copy.map((data) => data.battery_voltage),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Current (A)",
          data: solardata_copy.map((data) => data.battery_current),
          borderColor: "rgb(192, 75, 192)",
          backgroundColor: "rgb(192, 75, 192)",
        },
        {
          label: "Power (W)",
          data: solardata_copy.map((data) => data.battery_power),
          borderColor: "rgb(192, 192, 75)",
          backgroundColor: "rgb(192, 192, 75)",
        },
      ],
    });

    setSolarLineData({
      labels: solardata_copy.map((data) => data.date_time.split(" ")[3]),
      datasets: [
        {
          label: "Voltage (V)",
          data: solardata_copy.map((data) => data.solar_panel_voltage),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgb(75, 192, 192)",
        },
        {
          label: "Current (A)",
          data: solardata_copy.map((data) => data.solar_panel_current),
          borderColor: "rgb(192, 75, 192)",
          backgroundColor: "rgb(192, 75, 192)",
        },
        {
          label: "Power (W)",
          data: solardata_copy.map((data) => data.solar_panel_power),
          borderColor: "rgb(192, 192, 75)",
          backgroundColor: "rgb(192, 192, 75)",
        },
      ],
    });
  }, [solardata, nthElement]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      onValue(ref(db), (snapshot) => {
        const fetched = snapshot.val();
        setLoading(false);

        if (fetched) {
          const temp = Object.values(fetched.test);
          const sorted_data = temp.sort((a, b) => {
            return a.date_time - b.date_time;
          });
          console.log("FETCHED: ", sorted_data);

          const data = sorted_data.reverse();
          // if (data[sorted_data.length - 1].current < 0) {
          //   let popped = sorted_data.pop();
          // }

          setSolarData(
            data.map((doc) => ({
              ...doc,
              lux: doc.lux.toFixed(1),
              solar_panel_voltage: doc.solar_panel_voltage.toFixed(2),
              solar_panel_current: doc.solar_panel_current.toFixed(2),
              solar_panel_power: (
                doc.solar_panel_voltage * doc.solar_panel_current
              ).toFixed(2),
              battery_voltage: doc.battery_voltage.toFixed(2),
              battery_current: doc.battery_current.toFixed(2),
              battery_power: (
                doc.battery_voltage * doc.battery_current
              ).toFixed(2),
            }))
          );
        }
      });
    };
    getData();
  }, []);

  const handleSamplingChange = (e) => {
    console.log(e.target.value);
    setSamplingValue(e.target.value);

    switch (e.target.value) {
      case "High":
        setNthElement(1);
        break;
      case "Medium":
        setNthElement(3);
        break;
      case "Low":
        setNthElement(5);
        break;
      default:
        setNthElement(3);
        break;
    }
  };

  return (
    <div className="App">
      <div className="navbar">
        <h1 className="title-header">Dashboard</h1>
        <div className="sampling-selector">
          <label>Sampling Rate</label>
          <select value={samplingValue} onChange={handleSamplingChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid-wrapper">
        <div className="chart-container-1">
          {solardata.length > 0 ? (
            <SolarPanelLineChart chartData={solarLineData} />
          ) : (
            <p>Unable to load chart</p>
          )}
        </div>
        <div className="chart-container-2">
          {solardata.length > 0 ? (
            <BatteryLineChart chartData={batteryLineData} />
          ) : (
            <p></p>
          )}
        </div>
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

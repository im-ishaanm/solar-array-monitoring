import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
} from "@progress/kendo-react-charts";
import { COLORS } from "../constants";

import { useState } from "react";

export const series = [
  {
    name: "Total",
    data: [19, 9, 20],
    color: COLORS.total,
  },
  {
    name: "Pending",
    data: [12, 6, 15],
    color: COLORS.pending,
  },
  {
    name: "Fulfilled",
    data: [7, 3, 5],
    color: COLORS.accepted,
  },
];

const power = [];
const categories = [1, 2, 3, 4];

const LineChart = (solardata) => {
  //   const [data, setData] = useState(solardata);

  solardata.map((obj) => {
    power.append(obj.power);
  });

  return (
    <Chart pannable zoomable style={{ height: 350 }}>
      <ChartTitle text="Solar Array status - last 24 hours" />
      <ChartValueAxis>
        <ChartValueAxisItem title={{ text: "Power" }} min={0} max={30} />
      </ChartValueAxis>
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories} />
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem
          key={solardata.id}
          type="line"
          tooltip={{ visible: true }}
          data={power}
          name="Power"
        />
      </ChartSeries>
    </Chart>
  );
};

export default LineChart;

import { StockData } from "./api-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function Chart({ data }: { data: StockData }) {
  const dataByDate = data.sort((a, b) => {
    return a.date - b.date;
  });

  return (
    <div className="" style={{ width: "100%" }}>
      <LineChart width={1200} height={400} data={dataByDate}>
        <Line type="monotone" dataKey="close" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="priceDate" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

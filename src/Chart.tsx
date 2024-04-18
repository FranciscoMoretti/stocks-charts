import { StockData } from "./api-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  stocks: { date: string; stockPrices: { ticker: string; price: number } }[];
}

const DIFFERENT_LINE_COLORS = ["#8884d8", "#4d8888", "#aa4d88", "#88aa4d"];

export function Chart({ stocks }: ChartProps) {
  const dataByDate = stocks.sort((a, b) => {
    return Number(a.date) - Number(b.date);
  });

  return (
    <div className="" style={{ width: "100%" }}>
      <LineChart width={1200} height={400} data={dataByDate}>
        {
          // Create a Line for each stock
          stocks.length &&
            Object.keys(stocks[0])
              .filter((key) => key !== "date")
              .map((ticker, i) => {
                return (
                  <Line
                    key={`stockPrices.${ticker}`}
                    type="monotone"
                    dataKey={ticker}
                    stroke={DIFFERENT_LINE_COLORS[i]}
                  />
                );
              })
        }
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="priceDate" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

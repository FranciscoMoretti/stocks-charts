import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface ChartProps {
  stocks: { date: string; stockPrices: { [ticker: string]: number } }[];
  isPending: boolean;
}

const DIFFERENT_LINE_COLORS = ["#8884d8", "#4d8888", "#aa4d88", "#88aa4d"];

export function Chart({ stocks, isPending }: ChartProps) {
  const dataByDate = stocks.sort((a, b) => {
    return Number(a.date) - Number(b.date);
  });

  return (
    <div className="" style={{ width: "100%", padding: "20px" }}>
      <LineChart width={1200} height={500} data={dataByDate}>
        {
          // Create a Line for each stock
          !isPending
            ? stocks.length &&
              Object.keys(stocks[0].stockPrices).map((ticker, i) => {
                return (
                  <Line
                    key={`stockPrices.${ticker}`}
                    type="monotone"
                    dataKey={`stockPrices.${ticker}`}
                    stroke={DIFFERENT_LINE_COLORS[i]}
                  />
                );
              })
            : null
        }
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="priceDate" />
        <YAxis />
        <Tooltip />
      </LineChart>
    </div>
  );
}

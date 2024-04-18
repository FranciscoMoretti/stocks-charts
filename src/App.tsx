import "./App.css";
import { Chart } from "./Chart";
import { TickerSearcher } from "./TickerSearcher";
import { useStockPrice } from "./useStockPrice";

function App() {
  const {
    stockData: stockData1,
    isSuccess: isSuccess1,
    ticker: ticker1,
    setTicker: setTicker1,
    isPending: isPending1,
    setInterval: setInterval1,
    interval,
  } = useStockPrice("SPY", "1m", "data-1");
  const {
    stockData: stockData2,
    isSuccess: isSuccess2,
    ticker: ticker2,
    setTicker: setTicker2,
    isPending: isPending2,
    setInterval: setInterval2,
  } = useStockPrice("IRBT", "1m", "data-2");

  // Convert to format: {date: string, ticker1: number, ticker2: number}[]
  const isFetching = isPending1 || isPending2;
  console.log(stockData1);
  const chartData =
    isSuccess1 && isSuccess2 && !isFetching
      ? stockData1.map((dataPoint: any, index: number) => {
          return {
            date: dataPoint.date,
            stockPrices: {
              [ticker1]: dataPoint.close,
              [ticker2]: stockData2 ? stockData2[index]?.close : undefined,
            },
          };
        })
      : [];

  console.log(isPending1, isPending2);

  return (
    <>
      <h1>Stocks Chart</h1>
      <Chart stocks={chartData} isPending={isPending1 || isPending2} />
      <div
        style={{
          display: "flex",
          flex: "row",
          gap: "12px",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <select
          onChange={(e) => {
            setInterval1(e.target.value);
            setInterval2(e.target.value);
          }}
          value={interval}
        >
          <option value="1m">1m</option>
          <option value="1y">1y</option>
          <option value="5y">5y</option>
        </select>
        <TickerSearcher
          selectTicker={setTicker1}
          ticker={ticker1}
          queryKey="ticker1"
        />
        <TickerSearcher
          selectTicker={setTicker2}
          ticker={ticker2}
          queryKey="ticker2"
        />
      </div>
    </>
  );
}

export default App;

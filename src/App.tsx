import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { InputGroup } from "@blueprintjs/core";
import "./App.css";
import { Chart } from "./Chart";
import { StockData } from "./api-types";

function useStockPrice(tickerName: string) {
  const [stockData, setStockData] = useState<StockData>([]);
  const [ticker, setTicker] = useState(tickerName);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setIsLoading(true);

    fetch(
      `https://api.iex.cloud/v1/data/CORE/HISTORICAL_PRICES/${ticker}?token=${
        import.meta.env.VITE_IEXCLOUD_SECRET_KEY
      }&range=1m`,
      { signal }
    )
      .then((res) => {
        return res.json().then((data) => {
          setStockData(data);
          console.log(data);
          setIsLoading(false);
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error(err);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [ticker]);

  return { stockData, ticker, setTicker, isLoading };
}

function App() {
  const {
    stockData: stockData1,
    ticker: ticker1,
    setTicker: setTicker1,
    isLoading: isLoading1,
  } = useStockPrice("SPY");
  const {
    stockData: stockData2,
    ticker: ticker2,
    setTicker: setTicker2,
    isLoading: isLoading2,
  } = useStockPrice("IRBT");

  if (isLoading1 || isLoading2) {
    return <div>Loading...</div>;
  }

  // Convert to format: {date: string, ticker1: number, ticker2: number}[]
  const chartData = stockData1.map((dataPoint: any, index: number) => {
    return {
      date: dataPoint.date,
      [ticker1]: dataPoint.close,
      [ticker2]: stockData2[index].close,
    };
  });

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <InputGroup />
      {chartData && <Chart stocks={chartData} />}
    </>
  );
}

export default App;

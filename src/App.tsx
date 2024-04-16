import { useEffect, useState } from "react";
import { InputGroup } from "@blueprintjs/core";
import "./App.css";
import { Chart } from "./Chart";
import { StockData } from "./api-types";

function useStockPrice(tickerName: string, initialInterval = "1m") {
  const [interval, setInterval] = useState(initialInterval);
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
      }&range=${interval}`,
      { signal }
    )
      .then((res) => {
        return res.json().then((data) => {
          setStockData(data);
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
  }, [ticker, interval]);

  return { stockData, ticker, setTicker, isLoading, interval, setInterval };
}

function TickerSearcher({
  ticker,
  selectTicker,
}: {
  ticker: string;
  selectTicker: (ticker: string) => void;
}) {
  const [tickers, setTickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(ticker);

  useEffect(() => {
    fetch(
      `https://api.iex.cloud/v1/search/${searchTerm}?token=${
        import.meta.env.VITE_IEXCLOUD_SECRET_KEY
      }`
    )
      .then((res) => {
        return res.json().then((data) => {
          console.log(data);
          setTickers(data.map((ticker: any) => ticker.symbol));
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [searchTerm]);

  return (
    <div style={{ width: "500px" }}>
      <InputGroup
        large
        placeholder="Search..."
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul style={{ width: "500px" }}>
        {tickers.map((ticker) => {
          return (
            <li style={{ listStyle: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {ticker}
                <button
                  style={{ background: "white", color: "black" }}
                  onClick={() => selectTicker(ticker)}
                >
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  const {
    stockData: stockData1,
    ticker: ticker1,
    setTicker: setTicker1,
    isLoading: isLoading1,
    setInterval: setInterval1,
    interval,
  } = useStockPrice("SPY", "1m");
  const {
    stockData: stockData2,
    ticker: ticker2,
    setTicker: setTicker2,
    isLoading: isLoading2,
    setInterval: setInterval2,
  } = useStockPrice("IRBT", "1m");

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
      <h1>Stocks Chart</h1>
      {chartData && <Chart stocks={chartData} />}
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
        <TickerSearcher selectTicker={setTicker1} ticker={ticker1} />
        <TickerSearcher selectTicker={setTicker2} ticker={ticker2} />
      </div>
    </>
  );
}

export default App;

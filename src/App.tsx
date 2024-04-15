import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Chart } from "./Chart";

function App() {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetch(
      `https://api.iex.cloud/v1/data/CORE/HISTORICAL_PRICES/SPY?token=${
        import.meta.env.VITE_IEXCLOUD_SECRET_KEY
      }&range=1m`,
      { signal }
    )
      .then((res) => {
        return res.json().then((data) => {
          setStockData(data);
          console.log(data);
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
  }, []);

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
      <Chart data={stockData} />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;

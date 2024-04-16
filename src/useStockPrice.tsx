import { useEffect, useState } from "react";
import { StockData } from "./api-types";

export function useStockPrice(tickerName: string, initialInterval = "1m") {
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
        try {
          if (!res.ok) {
            console.error(res);
            throw new Error("Failed to fetch");
          }
          return res
            .json()
            .then((data) => {
              setStockData(data);
              setIsLoading(false);
            })
            .catch((err) => console.error(err));
        } catch (err) {
          console.error(err);
        }
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

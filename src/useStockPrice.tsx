import { useState } from "react";
import { StockData } from "./api-types";
import { QueryClient, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function useStockPrice(
  tickerName: string,
  initialInterval = "1m",
  id: string
) {
  const [interval, setIntervalInternal] = useState(initialInterval);
  const [ticker, setTickerInternal] = useState(tickerName);

  const { isSuccess, isPending, error, data } = useQuery({
    queryKey: [`stock_price-${id}`],
    queryFn: () =>
      fetch(
        `https://api.iex.cloud/v1/data/CORE/HISTORICAL_PRICES/${ticker}?token=${
          import.meta.env.VITE_IEXCLOUD_SECRET_KEY
        }&range=${interval}`
      ).then((res) => res.json()) as Promise<StockData>,
  });

  function setTicker(ticker: string) {
    setTickerInternal(ticker);
    queryClient.invalidateQueries({ queryKey: [`stock_price-${id}`] });
  }

  function setInterval(ticker: string) {
    setIntervalInternal(ticker);
    queryClient.invalidateQueries({ queryKey: [`stock_price-${id}`] });
  }

  return {
    stockData: data,
    ticker,
    interval,
    setInterval: setInterval,
    setTicker: setTicker,
    isSuccess,
    isPending,
    error,
  };
}

import { useEffect, useState } from "react";
import { StockData } from "./api-types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useStockPrice(
  tickerName: string,
  initialInterval = "1m",
  id: string
) {
  const queryClient = useQueryClient();
  const [interval, setIntervalInternal] = useState(initialInterval);
  const [ticker, setTickerInternal] = useState(tickerName);

  console.log({ interval, ticker, id });

  const { isSuccess, isPending, error, data } = useQuery({
    queryKey: [`stockprice-${id}`],
    queryFn: () =>
      fetch(
        `https://api.iex.cloud/v1/data/CORE/HISTORICAL_PRICES/${ticker}?token=${
          import.meta.env.VITE_IEXCLOUD_SECRET_KEY
        }&range=${interval}`
      ).then((res) => res.json()) as Promise<StockData>,
  });
  console.log(data);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: [`stockprice-${id}`] });
  }, [interval, ticker]);

  return {
    stockData: data,
    ticker,
    interval,
    setInterval: (newInterval: string) => {
      setIntervalInternal(newInterval);
    },
    setTicker: (newTicker: string) => {
      setTickerInternal(newTicker);
    },
    isSuccess,
    isPending,
    error,
  };
}

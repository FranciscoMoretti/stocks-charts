import { useEffect, useState } from "react";
import { InputGroup } from "@blueprintjs/core";

export function TickerSearcher({
  ticker,
  selectTicker,
}: {
  ticker: string;
  selectTicker: (ticker: string) => void;
}) {
  const [tickers, setTickers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(ticker);

  useEffect(() => {
    if (!searchTerm) {
      setTickers([]);
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;
    fetch(
      `https://api.iex.cloud/v1/search/${searchTerm}?token=${
        import.meta.env.VITE_IEXCLOUD_SECRET_KEY
      }`,
      {
        signal,
      }
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
              setTickers(data.map((ticker: any) => ticker.symbol));
            })
            .catch((err) => console.error(err));
        } catch (err) {
          console.error(err);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    return () => abortController.abort();
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
            <li key={ticker} style={{ listStyle: "none" }}>
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

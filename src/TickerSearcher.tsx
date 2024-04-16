import { useState } from "react";
import { InputGroup } from "@blueprintjs/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AutocompleteResponse } from "./api-types";

async function fetchTickers(searchTerm: string): Promise<Response> {
  return await fetch(
    `https://api.iex.cloud/v1/search/${searchTerm}?token=${
      import.meta.env.VITE_IEXCLOUD_SECRET_KEY
    }`
  );
}

export function TickerSearcher({
  ticker,
  selectTicker,
  queryKey,
}: {
  ticker: string;
  selectTicker: (ticker: string) => void;
  queryKey: string;
}) {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState(ticker);
  const { data: tickers, isSuccess } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      if (!searchTerm) {
        return [];
      }
      const res = await fetchTickers(searchTerm);
      if (!res.ok) {
        console.error(res);
        throw new Error("Failed to fetch");
      }

      return (await res.json()) as AutocompleteResponse;
    },
    select: (data) => data.map((ticker) => ticker.symbol),
  });

  return (
    <div style={{ width: "500px" }}>
      <InputGroup
        large
        placeholder="Search..."
        type="search"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        }}
      />
      <ul style={{ width: "500px" }}>
        {!isSuccess && <li>Loading...</li>}
        {isSuccess &&
          tickers.map((ticker) => {
            return (
              <li key={ticker} style={{ listStyle: "none" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {ticker}
                  <button
                    style={{ background: "white", color: "black" }}
                    onClick={() => {
                      selectTicker(ticker);
                    }}
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

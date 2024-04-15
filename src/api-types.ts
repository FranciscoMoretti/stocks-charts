export type StockData = DataPoint[];

export interface DataPoint {
  close: number;
  fclose: number;
  fhigh: number;
  flow: number;
  fopen: number;
  fvolume: number;
  high: number;
  low: number;
  open: number;
  priceDate: string;
  symbol: string;
  uclose: number;
  uhigh: number;
  ulow: number;
  uopen: number;
  uvolume: number;
  volume: number;
  id: string;
  key: string;
  subkey: string;
  date: number;
  updated: number;
}

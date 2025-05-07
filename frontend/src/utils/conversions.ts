import { useEffect } from "react";
import { LiveAssets, TestAssets } from "./assets";
import { PriceData } from "../pages/wallet/Assets";

/** @format */
const isDev = process.env.REACT_APP_NODE_ENV === "development";
export const assets = isDev ? TestAssets : LiveAssets;
type Prices = {
    xNGN: number;
    BTC: number;
    SOL: number;
    ETH: number;
    USDT: number;
    BTC_TEST: number;
    SOL_TEST: number;
    ETH_TEST5: number;
    USDT_ETH_TEST5_KDZ7: number;
    TRX_TEST: number;
    USDT_TRX_TEST: number;
    USDT_SOL_TEST: number
    USDT_TRC20: number;
    USDT_SOL: number;
    TRX: number;
    USDT_TRX: number;
    // trx:usdt: number;,
  
};




export function convertNairaToAsset(
  asset: keyof typeof assets,
    nairaAmount: number,
  adPrice:number,
  prices: Prices
): number | null {
  const usdPriceOfAsset = prices[asset];
  const ngnToUsdRate = adPrice;

  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const amountInUsd = nairaAmount / ngnToUsdRate;
  const assetAmount = amountInUsd / usdPriceOfAsset;

  return Number(assetAmount.toFixed(6));
}

export function convertAssetToNaira(
  asset: keyof Prices,
  assetAmount: number,
  adPrice: number,
  prices: Prices
): number | null {
  const usdPriceOfAsset = prices[asset];
  const ngnToUsdRate = adPrice;

  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const valueInUsd = assetAmount * usdPriceOfAsset;
  const valueInNaira = valueInUsd * ngnToUsdRate;

  return Math.round(valueInNaira);
}

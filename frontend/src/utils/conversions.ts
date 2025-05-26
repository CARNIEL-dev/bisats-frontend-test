import { useEffect } from "react";
import { LiveAssets, TestAssets } from "./assets";
import { PriceData } from "../pages/wallet/Assets";
import { getLivePrice } from "../helpers";

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
  prices?: Prices
): number | null {
    const pricces = getLivePrice() as Prices
  const usdPriceOfAsset = pricces[asset];
  const ngnToUsdRate = adPrice;

    console.log(ngnToUsdRate,usdPriceOfAsset)
  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const amountInUsd = nairaAmount / ngnToUsdRate;
  const assetAmount = amountInUsd / usdPriceOfAsset;

  return Number(assetAmount.toFixed(2));
}

export function convertAssetToNaira(
  asset: keyof Prices,
  assetAmount: number,
  adPrice: number,
  prices: Prices
): number | null {
    console.log(asset,assetAmount,adPrice,prices)
  const usdPriceOfAsset = prices[asset];
  const ngnToUsdRate = adPrice;
  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const valueInUsd = assetAmount * usdPriceOfAsset;
    const valueInNaira = valueInUsd * ngnToUsdRate;

  return Math.round(valueInNaira);
}




export function convertAssetToUSD(
  asset: keyof Prices,
  assetAmount: number,
  adPrice: number,
  prices: Prices
): number | null {
  if ( !prices)
    return null;
  const usdPriceOfAsset = prices[asset];
    console.log(assetAmount, usdPriceOfAsset);

    // if (!usdPriceOfAsset ) return null;
    console.log(assetAmount, usdPriceOfAsset);

  const valueInUsd =
    asset !== "xNGN" ? assetAmount * usdPriceOfAsset : assetAmount/usdPriceOfAsset;
  

  return Math.round(valueInUsd);
}

export function convertUSDToAsset(
  asset: keyof Prices,
  usdAmount: number,
  prices: Prices
): number | null {
  if (!prices || !prices[asset]) return null;

  const assetPriceInUsd = prices[asset];

  const amountInAsset =
    asset !== "xNGN"
      ? usdAmount / assetPriceInUsd
      : usdAmount * assetPriceInUsd;

  return Number(amountInAsset.toFixed(8))??0; 
}

import { LiveAssets, TestAssets } from "@/utils/assets";
import { getLivePrice } from "@/helpers";

/** @format */
const isDev = process.env.REACT_APP_NODE_ENV === "development";
export const assets = isDev ? TestAssets : LiveAssets;

export function convertNairaToAsset(
  asset: keyof typeof assets,
  nairaAmount: number,
  adPrice: number,
  prices?: Prices
): number | null {
  const pricces = getLivePrice() as Prices;
  const usdPriceOfAsset = pricces[asset];
  const ngnToUsdRate = adPrice;

  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const amountInUsd = nairaAmount / ngnToUsdRate;
  const assetAmount = amountInUsd / usdPriceOfAsset;

  return Number(assetAmount.toFixed(2));
}

export function convertAssetToNaira(
  asset: keyof Prices,
  assetAmount: number,
  adPrice: number,
  prices: Partial<Prices> | undefined
): number | null {
  const usdPriceOfAsset = prices?.[asset];
  const ngnToUsdRate = adPrice !== 0 ? adPrice : prices?.xNGN;
  if (!usdPriceOfAsset || !ngnToUsdRate || asset === "xNGN") return null;

  const valueInUsd = assetAmount * usdPriceOfAsset;
  const valueInNaira = valueInUsd * ngnToUsdRate;

  return Math.round(valueInNaira);
}

export function convertAssetToUSD(
  asset: string,
  assetAmount: number,
  prices: Prices
): number | null {
  if (!prices) return null;
  const usdPriceOfAsset = prices[asset as keyof typeof prices];
  const valueInUsd =
    asset !== "xNGN"
      ? assetAmount * usdPriceOfAsset
      : assetAmount / usdPriceOfAsset;

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

  return Number(amountInAsset.toFixed(8)) ?? 0;
}

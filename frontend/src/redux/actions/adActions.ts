/** @format */

import { AdActionTypes } from "../types";
import { Dispatch } from "redux";
import { BACKEND_URLS } from "../../utils/backendUrls";
import Bisatsfetch from "../fetchWrapper";
import Toast from "../../components/Toast";

export interface IAd {
	id?: string;
	type: string;
	priceType: string;
	currency?: string;
	priceMargin: number;
	asset: string;
	amount?: number;
	amountFilled: number;
	price: number;
	status: string;
	createdAt?: string;
	closedAt?: string;
}

export const GetAds = async (payload: { userId: string }) => {
	try {
		const response = await Bisatsfetch(
			`/api/v1/user/${payload.userId}${BACKEND_URLS.P2P.ADS.GET_ALL}`,
			{
				method: "GET",
			}
		);

		console.log("Response data:", response);
		return response;
	} catch (error: any) {
		console.error("Error fetching ads:", error);
		return error;
	}
};

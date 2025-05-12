/** @format */

import { AdActionTypes } from "../types";
import { Dispatch } from "redux";
import Bisatsfetch from "../fetchWrapper";

export interface IAd {
	id?: string;
	type: string;
	priceType: string;
	currency?: string;
	priceMargin: number;
	asset: string;
	amount?: number;
	quantity?: number;
	amountFilled: number;
	price: number;
	status: string;
	createdAt?: string;
	closedAt?: string;
}

// Action Creators
export const getAdsRequest = () => ({
	type: AdActionTypes.GET_ADS_REQUEST,
});

export const getAdsSuccess = (ads: IAd[]) => ({
	type: AdActionTypes.GET_ADS_SUCCESS,
	payload: ads,
});

export const getAdsFailure = (error: string) => ({
	type: AdActionTypes.GET_ADS_FAILURE,
	payload: error,
});

// Thunk action to fetch user ads
export const fetchUserAds = (userId: string) => {
	return async (dispatch: Dispatch) => {
		// Dispatch request action
		dispatch(getAdsRequest());

		try {
			// Make API call using the expected payload structure
			const response = await GetAds({ userId });

			console.log("User Ads API Response:", response);

			if (response.status && response.data) {
				// Dispatch success action with ads data
				dispatch(getAdsSuccess(response.data));
				return response.data;
			} else {
				// Handle empty or error response
				const errorMessage = response.message || "Failed to fetch ads";
				dispatch(getAdsFailure(errorMessage));
				return [];
			}
		} catch (error: any) {
			console.error("Error fetching user ads:", error);
			const errorMessage = error.message || "An unknown error occurred";
			dispatch(getAdsFailure(errorMessage));
			return [];
		}
	};
};

// You can keep the direct API call for cases where you don't need Redux
export const GetAds = async (payload: { userId: string }) => {
	try {
		const response = await Bisatsfetch(
			`/api/v1/user/${payload.userId}/ads/get-user-ads`,
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

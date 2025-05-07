import { AdActionTypes } from "../types";

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

const initialState = {
	loading: false,
	error: null,
	ads: [],
	activeAds: [],
	closedAds: [],
};

const adReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case AdActionTypes.GET_ADS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case AdActionTypes.GET_ADS_SUCCESS:
			// Filter ads based on status
			const activeAds = action.payload.filter(
				(ad: IAd) => ad.status.toLowerCase() === "active"
			);
			const closedAds = action.payload.filter(
				(ad: IAd) => ad.status.toLowerCase() === "closed"
			);

			return {
				...state,
				loading: false,
				ads: action.payload,
				activeAds,
				closedAds,
				error: null,
			};
		case AdActionTypes.GET_ADS_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};

export default adReducer;

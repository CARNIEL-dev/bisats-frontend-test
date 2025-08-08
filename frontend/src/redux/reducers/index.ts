/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import walletReducer from "./walletSlice";
import adReducer from "./adSlice";

const appReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
  ad: adReducer,
});
export default appReducer;

/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import walletReducer from "./walletSlice";
import adReducer from "./adSlice";
import notificationReducer from "./notificationSlice";

const appReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
  ad: adReducer,
  notification: notificationReducer,
});
export default appReducer;

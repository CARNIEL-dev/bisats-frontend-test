/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import walletReducer from "./walletSlice";

const appReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
});
export default appReducer;

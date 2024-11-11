/** @format */

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const appReducer = combineReducers({
  user: userReducer,
});
export default appReducer;

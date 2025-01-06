/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers";
import { getAppState, setAppState } from "../helpers";

// import advertsReducer from "./features/adverts/advertsSlice";
const preloadedState = getAppState();

const store = createStore(appReducer, preloadedState);
store.subscribe(() => {
  setAppState(store.getState());
});

export default store;

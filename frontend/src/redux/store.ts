/** @format */

import { createStore } from "redux";
import { getAppState, setAppState } from "../helpers";
import appReducer from "./reducers";

// import advertsReducer from "./features/adverts/advertsSlice";
const preloadedState = getAppState();

const store = createStore(appReducer, preloadedState);
store.subscribe(() => {
  setAppState(store.getState());
});

export default store;

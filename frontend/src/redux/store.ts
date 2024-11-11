/** @format */

import { configureStore } from "@reduxjs/toolkit";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers";

// import advertsReducer from "./features/adverts/advertsSlice";

const store = createStore(appReducer);

export default store;

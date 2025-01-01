/** @format */

import { UserActionTypes } from "../types";

export interface UserState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    [key: string]: any;
  } | null;
  token: string | null;
}
interface UserActionProp {
  type: string;
  payload: Record<string, any>;
}

const initialState: UserState = {
  isAuthenticated: true,
  loading: false,
  user: null,
  token: null,
};

const userReducer = (state = initialState, action: UserActionProp) => {
  switch (action.type) {
    case UserActionTypes.LOG_IN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
      };
    case UserActionTypes.SIGN_UP:
      console.log(action.payload, action.type);
      return {
        ...state,
        isAuthenticated: true,
        user: action?.payload,
        token: action?.payload?.token,
      };
    default:
      return state;
  }
};
export default userReducer;

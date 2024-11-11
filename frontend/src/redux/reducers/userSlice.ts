/** @format */

import { UserActionTypes } from "../types";

interface UserState {
  isAuthenticated: boolean;
  loading: boolean;
  user: {
    [key: string]: any;
  } | null;
  token: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  token: null,
};

interface UserActionProp {
  type: string;
  payload: Record<string, any>;
}
const userReducer = (state = initialState, action: UserActionProp) => {
  switch (action.type) {
    case UserActionTypes.LOG_IN_SUCCESS:
      return {
        ...state,
        user: action?.payload?.user,
        token: action?.payload?.token,
      };
    default:
      return state;
  }
};
export default userReducer;

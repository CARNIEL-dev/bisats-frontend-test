/** @format */
import store from "@/redux/store";

const dispatchWrapper = ({
  type,
  payload,
}: {
  type: string;
  payload?: any;
}) => {
  store.dispatch({ type, payload });
};

export default dispatchWrapper;

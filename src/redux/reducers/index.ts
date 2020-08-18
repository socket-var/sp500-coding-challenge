import { combineReducers } from "redux";
import root from "./rootReducer";
import { RootReducerState } from "./rootReducer";

export interface State {
  root: RootReducerState;
}

export default combineReducers({ root });

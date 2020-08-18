import { Action } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { FETCH_DATA } from "./actionTypes";
import spData from "../history.json";
import { State } from "./reducers";

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  State,
  unknown,
  Action<string>
>;

export type ConnectedComponentProps<ProvidedProps, ReduxProps> = ProvidedProps &
  ReduxProps & { dispatch: ThunkDispatch<State, unknown, Action<string>> };

export interface RawSPData {
  year: number;
  totalReturn: string;
}

export interface SPData {
  year: number;
  totalReturn: number;
}

export interface FetchDataAction {
  type: typeof FETCH_DATA;
  payload: RawSPData[];
}

/** slickcharts doesn't allow cors so importing the json */
export const fetchDataAction = (): AppThunk<void> => async (dispatch) => {
  // const response = await fetch("https://www.slickcharts.com/sp500/returns/history.json");
  // const data: RawSPData = await response.json()

  dispatch({
    type: FETCH_DATA,
    payload: spData,
  });
};

import { FETCH_DATA } from "../actionTypes";
import { FetchDataAction, SPData } from "../actions";

export interface RootReducerState {
  data: SPData[];
}

const DEFAULT_STATE: RootReducerState = {
  data: [],
};

type ActionType = FetchDataAction;

export default (
  state = DEFAULT_STATE,
  action: ActionType
): RootReducerState => {
  switch (action.type) {
    case FETCH_DATA:
      const clonedData = [...action.payload];
      /** sorts data in ascending order */
      clonedData.sort(({ year: year1 }, { year: year2 }) => {
        return year1 > year2 ? 1 : -1;
      });
      const data = clonedData.map((item) => ({
        ...item,
        totalReturn: parseFloat(item.totalReturn),
      }));

      return {
        data,
      };
    default:
      return state;
  }
};

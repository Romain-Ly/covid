import { combineReducers } from 'redux';
import { ChoroplethReducer } from './store/choropleth/reducer';
import { DataReducer } from './store/data/reducer';
import {
  useSelector
} from 'react-redux';

/* Types. */
import { ChoroplethState } from './store/choropleth/types';
import { DataState } from './store/data/types';

//#region selectors

export const rootReducer = combineReducers({
  choropleth: ChoroplethReducer,
  data: DataReducer
});
export type RootState = ReturnType<typeof rootReducer>

/* Choropleth State. */
const selectChoropleth = (state: RootState) => state.choropleth;
export const useChoroplethState = (): ChoroplethState => {
  return useSelector(selectChoropleth);
};

/* Data State. */
const selectData = (state: RootState) => state.data;
export const useDistributionData = (): DataState => {
  return useSelector(selectData);
};

//#endregion selectors

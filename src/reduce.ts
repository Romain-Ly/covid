import { combineReducers } from 'redux';
import { ChoroplethReducer } from './store/choropleth/reducer';
import {
  useSelector
} from 'react-redux';

/* Types. */
import { ChoroplethState } from './store/choropleth/types';

//#region selectors

export const rootReducer = combineReducers({
  choropleth: ChoroplethReducer
});
export type RootState = ReturnType<typeof rootReducer>

const selectChoropleth = (state: RootState) => state.choropleth;
export const useChoroplethState = (): ChoroplethState => {
  return useSelector(selectChoropleth);
};

//#endregion selectors

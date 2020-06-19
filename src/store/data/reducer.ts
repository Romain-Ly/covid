import {
  SET_DISTRIBUTION_DATA,
  DistributionActionTypes,
  DataState
} from './types';

const initialDataState: DataState = {
  data: []
};

export const DataReducer = (
  state = initialDataState,
  action: DistributionActionTypes
): DataState => {
  switch (action.type) {
    case SET_DISTRIBUTION_DATA:
      return {
        data: action.data
      };
    default:
      return state;
  }
};

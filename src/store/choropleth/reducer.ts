import {
  SET_SCALE,
  ChoroplethActionTypes,
  ChoroplethState
} from './types';

const initialChoroplethState: ChoroplethState = {
  scale: 'ckmeans'
};

export const ChoroplethReducer = (
  state = initialChoroplethState,
  action: ChoroplethActionTypes
): ChoroplethState => {
  switch (action.type) {
    case SET_SCALE:
      return {
        scale: action.scale
      };
    default:
      return state;
  }
};

import {
  ChoroplethScales,
  SET_SCALE,
  ChoroplethActionTypes
} from './types';

export const setScale = (scale: ChoroplethScales): ChoroplethActionTypes => {
  return {
    type: SET_SCALE,
    scale: scale
  };
};

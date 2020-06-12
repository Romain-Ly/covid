export const SET_SCALE = 'SET_SCALE';

export type ChoroplethScales = 'quantile' | 'equals' | 'ckmeans'

export interface ChoroplethState {
  scale: ChoroplethScales
}

interface SetScale {
  type: typeof SET_SCALE
  scale: ChoroplethScales
}

export type ChoroplethActionTypes = SetScale;

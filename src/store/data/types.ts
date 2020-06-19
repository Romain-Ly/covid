export const SET_DISTRIBUTION_DATA = 'SET_DISTRIBUTION_DATA';

export interface RawData {
  key: string;
  value: number
}

export interface DataState {
  data: RawData[]
}

interface SetDistributionData {
  type: typeof SET_DISTRIBUTION_DATA
  data: RawData[]
}

export type DistributionActionTypes = SetDistributionData;

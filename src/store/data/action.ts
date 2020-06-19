import {
  RawData,
  SET_DISTRIBUTION_DATA,
  DistributionActionTypes
} from './types';

export const SetDistributionData = (data: RawData[]): DistributionActionTypes => {
  return {
    type: SET_DISTRIBUTION_DATA,
    data: data
  };
};

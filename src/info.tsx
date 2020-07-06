/* Libs */
import React from 'react';
import {
  buildQuantileScale,
  buildEqualsScale,
  buildCkmeansScale,
} from './helpers/scales';

/* Views. */
import { HistPlot } from './components/Chart/Hist';

/* Store. */
import {
  useChoroplethState,
  useDistributionData
} from './reduce';

/* Types. */
import { ChoroplethScales } from './store/choropleth/types';
import { scaleColor } from './helpers/scales';

interface ChoroplethDistributionProps {
  scale: ChoroplethScales
  data: number[]
}

export const ChoroplethDistribution = (props: ChoroplethDistributionProps) => {
  /* FIXME: should be on reduce and deduplicate from Map.tsx. */
  const colorsScale = [
    '#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C',
    '#BD0026', '#800026'
  ];

  let breaks: scaleColor[];
  switch (props.scale) {
    case 'equals':
      breaks = buildEqualsScale(props.data, colorsScale);
      break;
    case 'quantile':
      breaks = buildQuantileScale(props.data, colorsScale);
      break;
    case 'ckmeans':
    default:
      breaks = buildCkmeansScale(props.data, colorsScale);
      break;
  }

  /* count element for each bin */
  const bin: number[] = Array(breaks.length);

  bin.fill(0);
  props.data.forEach((elt) => {
    let previousBin = 0;
    for (let i = 0; i < breaks.length; i++) {
      if (elt < breaks[i].key) {
        bin[previousBin] += 1;
        return;
      }
      previousBin = i;
    }
    bin[previousBin] += 1;
  });

  let labels: number[] = Array();
  let colors: string[] = Array();
  breaks.forEach((scaleColor) => {
    labels.push(scaleColor.key);
    colors.push(scaleColor.value);
  });

  return (
    <HistPlot
      data={bin}
      labels={labels}
      colors={colors}
    />
  );
};

export const ChoroplethDistributionStore = () => {
  const choroState = useChoroplethState();
  const dataState = useDistributionData();
  let data: number[] = [];

  dataState.data.forEach((elt) => {
    data.push(elt.value);
  });

  return (
    <ChoroplethDistribution
      scale={choroState.scale}
      data={data}
    />
  );
};

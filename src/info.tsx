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
import { scaleColor } from './helpers/scales';

export const ChoroplethDistribution = () => {
  const choroState = useChoroplethState();
  const dataState = useDistributionData();
  let data: number[] = [];

  dataState.data.forEach((elt) => {
    data.push(elt.value);
  });

  /* FIXME: should be on reduce and deduplicate from Map.tsx. */
  const colorsScale = [
    '#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C',
    '#BD0026', '#800026'
  ];

  let breaks: scaleColor[];
  switch (choroState.scale) {
    case 'equals':
      breaks = buildEqualsScale(data, colorsScale);
      break;
    case 'quantile':
      breaks = buildQuantileScale(data, colorsScale);
      break;
    case 'ckmeans':
    default:
      breaks = buildCkmeansScale(data, colorsScale);
      break;
  }

  /* count element for each bin */
  const bin: number[] = Array(breaks.length);

  bin.fill(0);
  data.forEach((elt) => {
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

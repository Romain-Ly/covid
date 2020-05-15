/* Libs */
import React, {
  useRef
} from 'react';

import { quantile } from 'simple-statistics';

/* Views */
import Geojson, { GeojsonProps } from './Geojson';

/* Types */
import * as Leaflet from 'leaflet';

/* Helpers */

interface ChoroplethProps extends GeojsonProps {
  /* function returning the value for each geojson.properties. */
   getValue: (properties: GeoJSON.GeoJsonProperties ) => number;

  /* scale of colors used */
   colors?: string[]

   /* Function to calculate scale */
   scaleFunction?: 'quantile'
}

function buildQuantileScale(data: number[], colors: string[]): (x: number) => string {
  const nbDivision = colors.length;
  const quantiles = [];

  for (let i = 0; i < nbDivision; i++) {
    quantiles.push((100/nbDivision*i)/100);
  }

  const scale = quantile(data, quantiles);
  const scaleColor = scale.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);

  return ((x:number) => {
    let previousColor = scaleColor[0];

    for (let i = 0; i < scaleColor.length; i++) {
      if (x < scaleColor[i].key) {
        return previousColor.value;
      }
      previousColor = scaleColor[i];
    }
    return previousColor.value;
  });
}

function buildColorScale(props: ChoroplethProps): (x: number) => string {
  let data: number[] = [];

  props.geojson.current.features.forEach((feature) => {
    data.push(props.getValue(feature.properties));
  });

  switch (props.scaleFunction) {
    case 'quantile':
    default:
      return buildQuantileScale(data, props.colors);
  }
}

const Choropleth = React.forwardRef((props: ChoroplethProps, ref: any) => {
  const getColor = buildColorScale(props);

  function style(feature: GeoJSON.Feature) {
    return {
      fillColor: getColor(feature.properties.data.total.dc),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.65
    };
  }

  return (
    <Geojson
      ref={ref}
      geojson={props.geojson}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
      options={useRef<Leaflet.GeoJSONOptions>({style: style})}
      //style={style}
    />
  );

});

Choropleth.displayName = 'Choropleth';

Choropleth.defaultProps = {
  /* default leaflet choropleth scale from dark red red to  light yellow */
  colors: [
    '#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C',
    '#BD0026', '#800026'
  ],
  scaleFunction: 'quantile'
};

export default Choropleth;


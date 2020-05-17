/* Libs */
import React, {
  useRef
} from 'react';

import { quantile } from 'simple-statistics';

/* Views */
import Geojson, { GeojsonProps } from './Geojson';

/* Types */
import LegendInfo, {
  LegendInfoProps
} from './LegendInfo';
import * as Leaflet from 'leaflet';

/* Styles */
import 'css/choropleth.scss';

/* Interfaces */

type scaleColor = {
  key: number
  value: string
}

interface ChoroplethProps extends GeojsonProps {
  /* function returning the value for each geojson.properties. */
   getValue: (properties: GeoJSON.GeoJsonProperties ) => number;

  /* scale of colors used */
   colors?: string[]

   /* Function to calculate scale */
   scaleFunction?: 'quantile'
}

function buildQuantileScale(data: number[], colors: string[]): scaleColor[] {
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

  return scaleColor;
}

function buildColorScale(props: ChoroplethProps): scaleColor[] {
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

function getColorCb(scaleColor:  scaleColor[]): (x: number) => string {
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

const Choropleth = React.forwardRef((props: ChoroplethProps, ref: any) => {
  const scaleColors = buildColorScale(props);
  const getColor = getColorCb(scaleColors);
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

  //#region Geojson Information

  const renderRow = () => {
    let res = '';
    for (var i = 0; i < scaleColors.length; i++) {
      let curr = scaleColors[i];
      let value: string;

      let left, right, middle;
      if (scaleColors[i+1]) {
        left = curr.key;
        middle = '&ndash;';
        right = scaleColors[i+1].key;
      } else {
        left = '';
        middle = '>';
        right = curr.key;
      }
      value = `
      <div class="legend_color left col-sm">
        ${left}
      </div>
      <div class="legend_color col-sm-1">
        ${middle}
      </div>
      <div class="legend_color col-sm">
        ${right}
      </div>
    `;

      res += `
        <div class="row">
          <div class="legend_color col-sm-3">
            <i style="background:${curr.value}"></i>
          </div>
          ${value}
        </div>
      `;
    }

    return res;
  };

  const infoRender= (prop: LegendInfoProps) => {
    return (`
      <div class="legend">
        <h6 class="title">${prop.title}</h6>
        <div class="container">
          ${renderRow()}
        </div>
      </div>
    `);
  };

  //#endregion

  return (
    <div>
      <Geojson
        ref={ref}
        geojson={props.geojson}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
        options={useRef<Leaflet.GeoJSONOptions>({style: style})}
        //style={style}
      />
      <LegendInfo
        position='bottomright'
        title='Information'
        renderCb={infoRender}
        information={{title:''}}
      />
    </div>
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


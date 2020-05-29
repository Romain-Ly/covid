/* Libs */
import React, {
  useRef,
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
export type scaleColor = {
  key: number
  value: string
}

export interface ChoroplethProps {
  /* Used to emphaze legend row */
  selectedValue?: number

  /* function returning the value for each geojson.properties. */
   getValue: (properties: GeoJSON.GeoJsonProperties ) => number;

  /* scale of colors used */
   colors: string[]

   /* Function name to calculate scale */
   scaleName: string
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

function buildEqualsScale(data: number[], colors: string[]): scaleColor[] {
  const nbDivision = colors.length;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const equals = [];

  for (let i = 0; i < nbDivision; i++) {
    equals.push(min + (max-min)/nbDivision * i);
  }
  const scaleColor = equals.reduce((acc, curr, i) => {
    acc.push({key: curr, value: colors[i]});
    return acc;
  }, []);

  return scaleColor;
}

function buildColorScale(props: ChoroplethProps, geojson: GeoJSON.FeatureCollection): scaleColor[] {
  let data: number[] = [];

  geojson.features.forEach((feature) => {
    data.push(props.getValue(feature.properties));
  });

  switch (props.scaleName) {
    case 'equals':
      return buildEqualsScale(data, props.colors);
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

const Choropleth = React.forwardRef(
    (props: {controls: ChoroplethProps, geojson: GeojsonProps}, ref: any) =>
  {
  const scaleColors = buildColorScale(props.controls, props.geojson.geojson.current);
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

  const renderRow = (prop: LegendInfoProps) => {
    let res = '';
    let legendDone: boolean;
    const scaleColors = prop.scaleColors;

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

      /* emphase selected legend row. */
      let legendSelected: '_not_selected' | '_selected' = '_not_selected';
      let next = scaleColors[i+1];
      if (!legendDone) {
        if (next) {
          if (prop.value < next.key) {
            legendSelected = '_selected';
            legendDone = true;
          }
        } else {
          /* last legend tile. */
          legendSelected = '_selected';
          legendDone = true;
        }
      }

      let select = 'legend_text' + legendSelected;
      value = `
      <div class="legend_text left ${select} col-sm">
        ${left}
      </div>
      <div class="legend_text ${select} col-sm-1">
        ${middle}
      </div>
      <div class="legend_text ${select} right col-sm">
        ${right}
      </div>
      `;

      select = 'legend' + legendSelected;
      const toto = 'legend_row' + legendSelected;
      res += `
        <div class="row ${toto}">
          <div class="legend_color col-sm-3 ">
            <i class="${select}" style="background:${curr.value}"></i>
          </div>
          ${value}
        </div>
      `;

      legendSelected = '_not_selected'; /* use it only once. */
    }

    return res;
  };

  const infoRender = (prop: LegendInfoProps) => {
    return (`
      <div class="legend">
        <h6 class="title">${prop.title}</h6>
        <div class="container">
          ${renderRow(prop)}
        </div>
      </div>
    `);
  };

  //#endregion

  return (
    <div>
      <Geojson
        ref={ref}
        geojson={props.geojson.geojson}
        onMouseOver={props.geojson.onMouseOver}
        onMouseOut={props.geojson.onMouseOut}
        options={useRef<Leaflet.GeoJSONOptions>({style: style})}
        //style={style}
      />
      <LegendInfo
        position='bottomright'
        title='Information'
        renderCb={infoRender}
        information={{
          title: '',
          value: props.controls.selectedValue,
          scaleColors: scaleColors,
        }}
      />
    </div>
  );

});

Choropleth.displayName = 'Choropleth';

export default Choropleth;


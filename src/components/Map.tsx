/* Libs */
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import L from 'leaflet';
import * as Leaflet from 'leaflet';

import {
  Map,
  GeoJSON
} from 'react-leaflet';

/* Store. */
import {
  useChoroplethState,
  useDistributionData
} from '../reduce';

/* Views */
import LegendInfo, {
  LegendInfoProps
} from './LegendInfo';
import Choropleth from './Choropleth';
import TileLayers from './TileLayers';

/* Models */
import { HospData } from '../models/Hospitalisation';

/* Styles */
import 'css/map.scss';

interface MapProps {
  geojson: GeoJSON.FeatureCollection;
  data: HospData
}

const Layers = () => {
  const tiles = [{
      name: 'Mapnik',
      attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }, {
      name: 'B&W',
      attribution: '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }, {
      name: 'Positron',
      attribution: '&amp;copy <a href="https://carto.com/copyright">Carto</a> contributors',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
      checked: true
    }, {
      name: '"Dark Matter',
      attribution: '&amp;copy <a href="https://carto.com/copyright">Carto</a> contributors',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png'
    }];

  return (
    <TileLayers
      tiles={tiles}
    />
  );
};

const LeafletMap:FunctionComponent<MapProps> = (props: MapProps) => {
  const [properties, setProperties] = useState({
    title: 'Information',
    id: undefined,
    department: '',
    key: '',
    value: undefined
  });

  const state = {
    lat: 46.85,
    lng: 2.3518,
    zoom: 6.5,
  };

  //#region Choropleth

  const geoJsonRef = React.useRef(null);

  const geojsonOnMouseOver = (evt: Leaflet.LeafletMouseEvent): void =>  {
    /* Properties from leaflet feature properties */
    let layer = evt.propagatedFrom;

    layer.setStyle({
        weight: 4,
        opacity: 1,
        color: '#666666',
        dashArray: '3',
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    const props = evt.sourceTarget.feature.properties;

    setProperties({
      title: 'Information',
      id: props.code,
      department: props.nom,
      key: 'deceased',
      value: props.data.total.dc
    });
  };

  function geojsonOnMouseOut(evt: Leaflet.LeafletMouseEvent) {
    geoJsonRef.current.leafletElement.resetStyle(evt.propagatedFrom);
  }

  useEffect(() => {
    document.title = `Covid Information Map: current department ${properties.department}`;
  });

  //#endregion
  //#region Geojson Information

  const renderRow = (key: string, value: string | number) => {
    return (`
      <div class="row">
        <div class="col-sm-4">
          ${key}
        </div>
        <div class="col-sm">
          ${value}
        </div>
      </div>
    `);
  };

  const infoRender= (props: LegendInfoProps) => {
    return (`
      <div>
        <h6 class="title">${props.title}</h6>
        <div class="container">
          ${renderRow('dept', props.department)}
          ${renderRow(props.key, props.value)}
        </div>
      </div>
    `);
  };

  //#endregion
  const choroState = useChoroplethState();
  const DataState = useDistributionData();

  const position: L.LatLngExpression = [state.lat, state.lng];
  const memGeojsonOnMouseOver = useCallback(geojsonOnMouseOver, []);
  const memGeojsonOnMouseOut = useCallback(geojsonOnMouseOut, []);
  /* FIXME: should be on reduce. */
  const colors = [
    '#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C',
    '#BD0026', '#800026'
  ];

  return (
    <Map center={position} zoom={state.zoom}>
      <Layers/>
      <LegendInfo
        id='information'
        position='topright'
        title='Information'
        renderCb={infoRender}
        information={properties}
      />
      <Choropleth
        ref={geoJsonRef}
        controls={{
          colors: colors,
          scaleName: choroState.scale,
          selectedValue: properties.value,
          distributionData: DataState.data,
        }}
        geojson={{
          geojson: useRef<GeoJSON.FeatureCollection>(props.geojson),
          onMouseOver: memGeojsonOnMouseOver,
          onMouseOut: memGeojsonOnMouseOut
        }}
      />
    </Map>
  );
};

export default LeafletMap;

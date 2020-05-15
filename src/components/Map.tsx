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
} from 'react-leaflet';

/* Views */
import LegendInfo from './Legend';
import Choropleth from './Choropleth';
import TileLayers from './TileLayers';

/* Models */
import { HospData } from '../models/Hospitalisation';

/* Styles */
import 'css/map.scss';

/* Types */

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
    id: undefined,
    department: '',
    key: '',
    value: 0
  });

  const state = {
    lat: 46.85,
    lng: 2.3518,
    zoom: 6.5,
  };

  const geoJsonRef = useRef(null);

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
      id: props.code,
      department: props.nom,
      key: 'deceased',
      value: props.data.total.dc
    });
  };

  function geojsonOnMouseOut(evt: Leaflet.LeafletMouseEvent) {
    geoJsonRef.current.leafletElement.resetStyle(evt.sourceTarget);
  }

  useEffect(() => {
    document.title = `Covid Information Map: current department ${properties.department}`;
  });

  const position: L.LatLngExpression = [state.lat, state.lng];

  const memGeojsonOnMouseOver = useCallback(geojsonOnMouseOver, []);
  const memGeojsonOnMouseOut = useCallback(geojsonOnMouseOut, []);

  return (
    <Map center={position} zoom={state.zoom}>
      <Layers/>
      <LegendInfo
        title='Information'
        information={properties}
      />
      <Choropleth
        ref={geoJsonRef}
        geojson={useRef<GeoJSON.FeatureCollection>(props.geojson)}
        onMouseOver={memGeojsonOnMouseOver}
        onMouseOut={memGeojsonOnMouseOut}
        getValue={(prop) => prop.data.total.dc}
      />
    </Map>
  );
};

export default LeafletMap;

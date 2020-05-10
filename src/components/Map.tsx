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
  LayersControl,
  Map,
  TileLayer,
  Marker,
  Popup,
} from 'react-leaflet';

const { BaseLayer } = LayersControl;

/* Views */
import LegendInfo from './Legend';
import Geojson from './Geojson';

/* Models */
import { HospData } from '../models/Hospitalisation';

/* Styles */
import 'css/map.scss';

/* Types */

interface MapProps {
  geojson: GeoJSON.GeoJsonObject;
  data: HospData
}

type State = {
  lat: number,
  lng: number,
  zoom: number,
}

const Layers = () => {
  return (
    <LayersControl position="topleft">
      <BaseLayer checked name="Mapnik">
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="B&W">
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Positron">
        <TileLayer
          attribution='&amp;copy <a href="https://carto.com/copyright">Carto</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
        />
      </BaseLayer>
      <BaseLayer name="Dark Matter">
        <TileLayer
          attribution='&amp;copy <a href="https://carto.com/copyright">Carto</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
      </BaseLayer>
    </LayersControl>
  );
};

const LeafletMap:FunctionComponent<MapProps> = (props: MapProps) => {
  const [properties, setProperties] = useState({
    id: undefined,
    department: ''
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
      department: props.nom
    });
  };

  function geojsonOnMouseOut(evt: Leaflet.LeafletMouseEvent) {
    geoJsonRef.current.leafletElement.resetStyle(evt.sourceTarget);
  }

  function getColor(x: number) {
    return x > 0.05 ? '#800026' :
           x > 0.04  ? '#BD0026' :
           x > 0.03  ? '#E31A1C' :
           x > 0.02  ? '#FC4E2A' :
           x > 0.01  ? '#FD8D3C' :
           x > 0.005  ? '#FEB24C' :
           x > 0.001 ? '#FED976' :
                      '#FFEDA0';
  }

  function style(feature: GeoJSON.Feature) {
    return {
      fillColor: getColor(feature.properties.data.total.dc / props.data.countryTotal.dc),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.65
    };
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
        properties={properties}
      />
      <TileLayer
        attribution='&amp;copy <a href="https://carto.com/copyright">Carto</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png"
      />
      <Geojson
        ref={geoJsonRef}
        geojson={useRef<GeoJSON.GeoJsonObject>(props.geojson)}
        onMouseOver={memGeojsonOnMouseOver}
        onMouseOut={memGeojsonOnMouseOut}
        options={useRef<Leaflet.GeoJSONOptions>({style: style})}
      />
      <Marker position={position}>
        <Popup>
          Mark. <br />
        </Popup>
      </Marker>
    </Map>
  );
};

export default LeafletMap;

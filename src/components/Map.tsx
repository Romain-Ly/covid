import React, {
  useState, useRef, useEffect, FunctionComponent
} from 'react';

import L from 'leaflet';

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
import Geojson, { GeojsonInfoProps } from './Geojson';

/* Styles */
import 'css/map.scss';

/* Types */
import * as Leaflet from 'leaflet';

interface MapProps {
  geojson: GeoJSON.GeoJsonObject;
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
    var layer = evt.sourceTarget;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
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

  useEffect(() => {
    document.title = `Covid Information Map: current department ${properties.department}`;
  });

  const position: L.LatLngExpression = [state.lat, state.lng];

  return (
    <Map center={position} zoom={state.zoom}>
      <Layers/>
      <LegendInfo
        title='Information'
        properties={properties}
      />
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Geojson
        ref={geoJsonRef}
        geojson={props.geojson}
        onMouseOver={geojsonOnMouseOver}
        onMouseOut={geojsonOnMouseOut}
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

import React, {
  useRef,
} from 'react';

import L from 'leaflet';

import {
  GeoJSON,
  LayersControl,
  Map,
  TileLayer,
  Marker,
  Popup,
  useLeaflet
} from 'react-leaflet';

const { BaseLayer } = LayersControl;

import 'css/map.scss';

/* Types */
import * as Leaflet from 'leaflet';

interface MapProps {
  geojson: GeoJSON.GeoJsonObject;
}

interface GeojsonProps {
  geojson: GeoJSON.GeoJsonObject;
}

type State = {
  lat: number,
  lng: number,
  zoom: number,
}

const Layers = () => {
  return (
    <LayersControl position="topright">
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

const Geojson = (props: GeojsonProps) => {
  /** GeoJson wrapper */

  const geoJsonRef = useRef(null);
  const { map } = useLeaflet();

  function highlightFeature(evt: Leaflet.LeafletMouseEvent) {
    var layer = evt.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
  }

  function resetHighlight(evt: Leaflet.LeafletMouseEvent) {
    geoJsonRef.current.leafletElement.resetStyle(evt.target);
  }

  function zoomToFeature(evt: Leaflet.LeafletMouseEvent) {
    map.fitBounds(evt.target.getBounds());
  }

  function onEachFeature(feature: GeoJSON.GeoJsonObject, layer: any) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
  }

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={props.geojson}
      onEachFeature={onEachFeature}
    />
  );
};

export default class LeafletMap extends React.Component<MapProps, State> {
  state = {
    lat: 46.85,
    lng: 2.3518,
    zoom: 6.5,
  }

  render() {
    const position: L.LatLngExpression = [this.state.lat, this.state.lng];

    return (
      <Map center={position} zoom={this.state.zoom}>
        <Layers/>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Geojson
          geojson={this.props.geojson}
        />
        <Marker position={position}>
          <Popup>
            Mark. <br />
          </Popup>
        </Marker>
      </Map>
    );
  }
}
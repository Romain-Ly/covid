import React, { Component } from 'react';
import {
  GeoJSON,
  LayersControl,
  Map,
  TileLayer,
  Marker,
  Popup }
from 'react-leaflet';

const { BaseLayer } = LayersControl;

import 'css/map.scss';

/* Types */
import { FeatureCollection } from 'geojson';

interface MapProps {
  geojson: FeatureCollection;
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
        <GeoJSON
          data={this.props.geojson}
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
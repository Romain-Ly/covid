import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

type State = {
  lat: number,
  lng: number,
  zoom: number,
}

export default class SimpleExample extends React.Component<{}, State> {
  state = {
    lat: 46.85,
    lng: 2.3518,
    zoom: 6.5,
  }

  render() {
    const position: L.LatLngExpression = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom}>
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
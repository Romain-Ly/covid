import React from 'react';

/* Libs */
import {
  LayersControl,
  TileLayer
} from 'react-leaflet';

const { BaseLayer } = LayersControl;


interface TileLayerDesc {
  name: string
  attribution: string,
  url : string,
  checked?: boolean
}

export interface TileLayersProps {
  tiles: TileLayerDesc[]
}

const TileLayers = (props: TileLayersProps) => {
  const items = [];
  const keys = new Set();

  for (const tile of props.tiles) {
    keys.add(tile.name);

    items.push(
      <BaseLayer
        checked={tile.checked}
        name={tile.name}
        key={tile.name}
      >
        <TileLayer
          attribution={tile.attribution}
          url={tile.url}
        />
      </BaseLayer>
    );
  }

  if (keys.size != props.tiles.length) {
    console.warn('Duplicated names in tiles');
  }

  return (
    <LayersControl position="topleft">
      {items}
    </LayersControl>
  );
};

export default TileLayers;

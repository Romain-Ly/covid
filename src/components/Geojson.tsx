import React from 'react';

import {
  GeoJSON,
} from 'react-leaflet';

/* Types */
import * as Leaflet from 'leaflet';

/* Interfaces */
interface GeojsonProps {
  geojson: GeoJSON.GeoJsonObject;
  onMouseOver?: (evt: Leaflet.LeafletMouseEvent) => void;
  onMouseOut?: (evt: Leaflet.LeafletMouseEvent) => void;
  ref: any;
}

export type GeojsonInfoProps = {
  id: string | undefined;
  department: string;
}

const Geojson = (props: GeojsonProps, ref:any) => {
  /** GeoJson View */

  return (
    <GeoJSON
      ref={ref}
      data={props.geojson}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
    />
  );
};

export default React.forwardRef(Geojson);

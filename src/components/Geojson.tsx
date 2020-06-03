import React, {
  RefObject
} from 'react';

import {
  GeoJSON,
} from 'react-leaflet';

/* Types */
import * as Leaflet from 'leaflet';

/* Interfaces */
export interface GeojsonProps {
  geojson: RefObject<GeoJSON.FeatureCollection>;
  onMouseOver?: (evt: Leaflet.LeafletMouseEvent) => void;
  onMouseOut?: (evt: Leaflet.LeafletMouseEvent) => void;
  options?: Leaflet.GeoJSONOptions;
  geojsonkey?: string;
}

const Geojson = (props: GeojsonProps, ref:any) => {
  /** GeoJson View */

  return (
    <GeoJSON
      ref={ref}
      key={props.geojsonkey}
      data={props.geojson.current}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
      {...props.options}
    />
  );
};

export default React.memo(React.forwardRef(Geojson), (prev, next) => {
  if (prev.geojsonkey !== next.geojsonkey) {
    return false;
  }
  return true;
});

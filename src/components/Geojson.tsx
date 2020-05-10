import React, {
  RefObject
} from 'react';

import {
  GeoJSON,
} from 'react-leaflet';

/* Types */
import * as Leaflet from 'leaflet';

/* Interfaces */
interface GeojsonProps {
  geojson: RefObject<GeoJSON.GeoJsonObject>;
  onMouseOver?: (evt: Leaflet.LeafletMouseEvent) => void;
  onMouseOut?: (evt: Leaflet.LeafletMouseEvent) => void;
  options?: RefObject<Leaflet.GeoJSONOptions>;
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
      data={props.geojson.current}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
      {...props.options.current}
    />
  );
};

export default React.memo(React.forwardRef(Geojson));

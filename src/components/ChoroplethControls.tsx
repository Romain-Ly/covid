/* Libs */
import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import { ChoroplethScales, ChoroplethProps } from './Choropleth';

export interface ChoroplethControlsProps {
  onSelect: (evt: string) => void;
}

export const useChoroplethcontrols = () => {
  const [choroplethProps, setChoroplethProps] = useState({
    /* default leaflet choropleth scale from dark red red to  light yellow */
    colors: [
      '#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C',
      '#BD0026', '#800026'
    ],
    scaleName: 'quantile',
  } as ChoroplethProps);

  const select = (scale: ChoroplethScales) => {
    setChoroplethProps({
      ...choroplethProps,
      scaleName: scale,
    });
  };

  return { choroplethProps, select };
};

const ChoroplethControls = (props: ChoroplethControlsProps) => {
  return (
    <Dropdown
      onSelect={props.onSelect}
    >
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey='quantile'>Quantile</Dropdown.Item>
        <Dropdown.Item eventKey='equals'>Equals</Dropdown.Item>
        <Dropdown.Item eventKey='ckmeans'>Ckmeans</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ChoroplethControls;

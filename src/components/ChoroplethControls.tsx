/* Libs */
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

/* Store. */
import { useDispatch } from 'react-redux';
import { setScale } from '../store/choropleth/action';

/* Types. */
import { ChoroplethScales } from '../store/choropleth/types';

/* Interfaces */
export interface ChoroplethControlsProps {
  onSelect: (evt: string) => void;
}

const ChoroplethControls = () => {
  const dispatch = useDispatch();

  return (
    <Dropdown
      onSelect={(scale: ChoroplethScales) =>  { dispatch(setScale(scale)); }}
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

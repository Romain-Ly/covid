/* Libs */
import React from 'react';
import Form from 'react-bootstrap/Form';

/* Store. */
import { useDispatch } from 'react-redux';
import { setScale } from '../store/choropleth/action';
import { useChoroplethState } from '../reduce';

/* Types. */
import { ChoroplethScales } from '../store/choropleth/types';

/* XXX: hack to get FormControlElement when it is not exported from Form Control
 * see also https://github.com/DefinitelyTyped/DefinitelyTyped/issues/16208
 */
type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

/* Interfaces */
export interface ChoroplethControlsProps {
  onSelect: (evt: string) => void;
}

const ChoroplethControls = () => {
  const dispatch = useDispatch();
  const choroState = useChoroplethState();

  return (
    <Form.Group controlId="exampleForm.ControlSelect2">
      <Form.Label>Scale</Form.Label>
      <Form.Control
        as="select"
        onChange={(event: React.ChangeEvent<FormControlElement>) => {
          dispatch(setScale(event.target.value as ChoroplethScales));
        }}
        value={choroState.scale}
      >
        <option value='quantile'>quantile</option>
        <option value='equals'>equals</option>
        <option value='ckmeans'>ckmeans</option>
      </Form.Control>
    </Form.Group>
  );
};

export default ChoroplethControls;

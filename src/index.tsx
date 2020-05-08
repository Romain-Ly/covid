import React from 'react';
import * as ReactDOM from 'react-dom';

import LeafletMap from './components/Map';

import { fetchHospitalisationData } from './models/Hospitalisation';

/* Types */
import { FeatureCollection } from 'geojson';

const fetchFrenchDepartments = async () => {
  /** Get French departments geoJson */
  try {
    const response = await fetch('http://localhost:8080/public/assets/departements.geojson', {
      method: 'GET',
      headers: { 'Content-type': 'application/json; charset=UTF-8' },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const renderMap = async () => {
  const geojson: FeatureCollection = await fetchFrenchDepartments();
  const hostData = await fetchHospitalisationData();
  console.log(hostData);

  ReactDOM.render(
    <LeafletMap
      geojson={geojson}
    />,
    document.getElementById('map')
  );
};

renderMap();

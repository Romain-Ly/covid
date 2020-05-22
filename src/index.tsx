import React from 'react';
import * as ReactDOM from 'react-dom';

/* Views */
import LeafletMap from './components/Map';
import SideBar from './components/SideBar';

import { fetchHospitalisationData, HospData } from './models/Hospitalisation';

/* Styles */
import 'css/index.scss';

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
  const hospData: HospData = await fetchHospitalisationData();

  geojson.features = geojson.features.map((feature) => {
      const key = feature.properties.code;
      const data = hospData.deptData.get(key);

      if (data) {
        feature.properties.data = data;
      }
      return feature;
  });

  ReactDOM.render((
    <div className='wrapper'>
      <SideBar
        title='Geomap'
      />
      <LeafletMap
        geojson={geojson}
        data={hospData}
      />
    </div>
  ),
    document.getElementById('map')
  );
};

renderMap();

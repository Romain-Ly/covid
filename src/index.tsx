import React from 'react';
import * as ReactDOM from 'react-dom';

/* Store */
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { rootReducer } from './reduce';

/* Views */
import LeafletMap from './components/Map';
import NavBar from './NavBar';

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

const IndexPage = (props : { geojson: FeatureCollection, hospData: HospData }) => {
  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <div className='wrapper'>
        <div className='navbar'>
          <NavBar/>
        </div>
        <LeafletMap
          geojson={props.geojson}
          data={props.hospData}
        />
      </div>
    </Provider>
  );
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
    <IndexPage
      geojson={geojson}
      hospData={hospData}
    />
  ),
    document.getElementById('map')
  );
};

renderMap();

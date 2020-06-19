import React from 'react';
import * as ReactDOM from 'react-dom';

/* Store */
import { createStore } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import { rootReducer } from './reduce';
import { SetDistributionData } from './store/data/action';

/* Views */
import LeafletMap from './components/Map';
import NavBar from './NavBar';

/* Models. */
import { fetchHospitalisationData, HospData } from './models/Hospitalisation';

/* Styles */
import 'css/index.scss';

/* Types */
import { FeatureCollection } from 'geojson';
import { RawData } from './store/data/types';


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

/* FIXME: we should select data and should be in a model. */
const getDc = (data: GeoJSON.GeoJsonProperties) => data.total.dc;
const getDept = (data: GeoJSON.GeoJsonProperties) => data.total.dep;

const getDistributionData = (geojson: GeoJSON.FeatureCollection) => {
  let data: RawData[] = [];

  geojson.features.forEach((feature) => {
    data.push({
      key: getDept(feature.properties.data),
      value: getDc(feature.properties.data)
    });
  });

  return data;
};

const IndexPage = (props : { geojson: FeatureCollection, hospData: HospData }) => {
  const dispatch = useDispatch();

  const distribData = getDistributionData(props.geojson);
  dispatch(SetDistributionData(distribData));

  return (
    <div className='wrapper'>
      <div className='navbar'>
        <NavBar/>
      </div>
      <LeafletMap
        geojson={props.geojson}
        data={props.hospData}
      />
    </div>
  );
};

const renderMap = async () => {
  const store = createStore(rootReducer);

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
    <Provider store={store}>
      <IndexPage
        geojson={geojson}
        hospData={hospData}
    />
    </Provider>
  ),
    document.getElementById('map')
  );
};

renderMap();

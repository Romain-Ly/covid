import React from 'react';
import * as ReactDOM from 'react-dom';

/* Views */
import LeafletMap from './components/Map';
import SideBar from './components/SideBar';
import ChoroplethControls, {
  useChoroplethcontrols
} from './components/ChoroplethControls';

import { fetchHospitalisationData, HospData } from './models/Hospitalisation';

/* Styles */
import 'css/index.scss';

/* Types */
import { FeatureCollection } from 'geojson';
import { ChoroplethProps } from './components/Choropleth';

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
  const { choroplethProps, select } = useChoroplethcontrols();

  const choroProps: ChoroplethProps = {
    ...choroplethProps,
    getValue: (prop) => prop.data.total.dc,
  };

  return (
    <div className='wrapper'>
    <SideBar
      title='Geomap'
    >
    <ChoroplethControls
      onSelect={select}
    />
    </SideBar>
    <LeafletMap
      choropleth={choroProps}
      geojson={props.geojson}
      data={props.hospData}
    />
  </div>
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

/* Libs */
import React, {
  FunctionComponent,
  PropsWithChildren,
  useState
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faGlobeEurope,
  faInfo
} from '@fortawesome/free-solid-svg-icons';

import {
  SideBar,
  SideBarState,
  SideContent,
  SideIcon,
  useSideBar,
} from './components/SideBar';

/* Store. */
import {
  useChoroplethState,
  useDistributionData
} from './reduce';

/* Styles */
import 'css/navbar.scss';

/* Views */
import ChoroplethControls from './components/ChoroplethControls';
import {
  ChoroplethDistribution,
  ChoroplethDistributionStore
} from './info';

/* Interfaces */
interface HomeProps extends NavBarProps{
  onClick?: () => void
}

type ContentState =  'home' | 'choropleth' | 'info' | 'none'

interface ContentProps {
  contentState: ContentState
}

interface NavBarProps {
  state?: SideBarState
}

//#region Home

const HomeIcon = (props: HomeProps) => {
  let icon = faChevronCircleLeft;
  if (props.state === 'collapsed') {
    icon = faChevronCircleRight;
  }

  return (
    <button
      type="button"
      id="sidebarCollapse"
      className="btn btn-outline-light"
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        className="sidebar__button__icon"
        icon={icon}
        size="lg"
        onClick={props.onClick}
      />
    </button>
  );
};

const HomeContent = () => {
  return (
    <h3>
      GeoMap
    </h3>
  );
};

//#endregion
//#region choropleth

const ChoroplethIcon = (props: HomeProps) => {
  return (
    <button
      type="button"
      id="sidebarCollapse"
      className="btn btn-outline-light"
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        icon={faGlobeEurope}
        size="lg"
        onClick={props.onClick}
      />
    </button>
  );
};

const ChoroplethContent = () => {
  const choroState = useChoroplethState();
  const dataState = useDistributionData();
  let data: number[] = [];

  dataState.data.forEach((elt) => {
    data.push(elt.value);
  });

  return (
    <div
      className='choropleth_controls'
    >
      <ChoroplethControls/>
      <ChoroplethDistribution
        scale={choroState.scale}
        data={data}
      />
    </div>
  );
};

//#endregion
//#region info

const InfoIcon = (props: HomeProps) => {
  return (
    <button
      type="button"
      id="sidebarCollapse"
      className="btn btn-outline-light"
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        icon={faInfo}
        size="lg"
        onClick={props.onClick}
      />
    </button>
  );
};

const InfoContent = () => {
  return (
    <ChoroplethDistributionStore/>
  );
};

//#endregion

const NavContent = (props: ContentProps) => {
  switch (props.contentState) {
    case 'home':
      return HomeContent();
    case 'choropleth':
      return ChoroplethContent();
    case 'info':
      return InfoContent();
    default:
      return null;
  }

};

const NavBar: FunctionComponent<NavBarProps> = (_props: PropsWithChildren<NavBarProps>) => {
  const { state, onClick } = useSideBar();
  const [ contentState, setContent ] = useState<ContentState>('home');

  const setContentClick = (newState: ContentState) => {
    setContent(newState);
    if (state === 'collapsed'
    ||  contentState === newState)
    {
      onClick();
    }
  };

  const onHomeClick = () => {
    setContent('home');
    onClick();
  };

  const onChoroplethClick = () => setContentClick('choropleth');
  const onInfoClick = () => setContentClick('info');

  return (
    <SideBar
      state={state}
    >
      <SideIcon>
        <HomeIcon
          state={state}
          onClick={onHomeClick}
        />
        <ChoroplethIcon
          onClick={onChoroplethClick}
        />
        <InfoIcon
          onClick={onInfoClick}
        />
      </SideIcon>
      <SideContent>
        <NavContent
          contentState={contentState}
        />
      </SideContent>
    </SideBar>
  );
};

export default NavBar;

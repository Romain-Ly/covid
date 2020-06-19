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

/* Views */
import ChoroplethControls from './components/ChoroplethControls';
import { ChoroplethDistribution } from './info';

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
  return (
    <ChoroplethControls/>
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
    <ChoroplethDistribution/>
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

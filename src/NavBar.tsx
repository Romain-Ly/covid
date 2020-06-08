/* Libs */
import React, {
  FunctionComponent,
  PropsWithChildren,
  useState
} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronCircleRight,
  faGlobeEurope
} from '@fortawesome/free-solid-svg-icons';

import {
  SideBar,
  SideBarState,
  SideContent,
  SideIcon,
  useSideBar,
} from './components/SideBar';

import ChoroplethControls from './components/ChoroplethControls';
import { ChoroplethScales } from './components/Choropleth';

/* Interfaces */
interface HomeProps {
  onClick?: () => void
}

type ContentState =  'home' | 'choropleth' | 'none'

interface ContentProps {
  contentState: ContentState
  select: (scale: ChoroplethScales) => void
}

interface NavBarProps {
  state?: SideBarState
  select: (scale: ChoroplethScales) => void
}

//#region Home

const HomeIcon = (props: HomeProps) => {
  return (
    <button
      type="button"
      id="sidebarCollapse"
      className="btn btn-outline-light"
      onClick={props.onClick}
    >
      <FontAwesomeIcon
        className="sidebar__button__icon"
        icon={faChevronCircleRight}
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

const ChoroplethContent = (props: ContentProps) => {
  return (
    <ChoroplethControls
      onSelect={props.select}
    />
  );
};

//#endregion

const NavContent = (props: ContentProps) => {
  switch (props.contentState) {
    case 'home':
      return HomeContent();
    case 'choropleth':
      return ChoroplethContent(props);
    default:
      return null;
  }

};

const NavBar: FunctionComponent<NavBarProps> = (props: PropsWithChildren<NavBarProps>) => {
  const { state, onClick } = useSideBar();
  const [ contentState, setContent ] = useState<ContentState>();

  const onHomeClick = () => {
    setContent('home');
    onClick();
  };

  const onChoroplethClick = () => {
    setContent('choropleth');
    onClick();
  };

  return (
    <SideBar
      state={state}
    >
      <SideIcon>
        <HomeIcon
          onClick={onHomeClick}
        />
        <ChoroplethIcon
          onClick={onChoroplethClick}
        />
      </SideIcon>
      <SideContent>
        <NavContent
          select={props.select}
          contentState={contentState}
        />
      </SideContent>
    </SideBar>
  );
};

export default NavBar;

/* Libs */
import React, {
  FunctionComponent,
  PropsWithChildren
} from 'react';
import FA from 'react-fontawesome';

import {
  SideBar,
  SideBarState,
  SideContent,
  SideIcon,
  SideIconProps,
  SideLine,
  useSideBar,
} from './components/SideBar';

interface NavBarProps extends SideIconProps {}

/* Interfaces */
interface HomeProps {
  title: string,
  onClick?: () => void
  state?: SideBarState

}

const HomeIcon = (props: HomeProps) => {
  return (
    <SideLine>
      <SideIcon>
        <button
          type="button"
          id="sidebarCollapse"
          className="btn btn-outline-light"
          onClick={props.onClick}
        >
          <FA
            className="sidebar__button__icon"
            name="chevron-circle-right"
            size="lg"
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
            onClick={props.onClick}
          />
        </button>
      </SideIcon>
      <SideContent>
        <h3>
          {props.title}
        </h3>
      </SideContent>
    </SideLine>
  );
};

const NavBar: FunctionComponent<HomeProps> = (props: PropsWithChildren<HomeProps>) => {
  const { collapse, onClick } = useSideBar();

  return (
    <SideBar
      state={collapse}
    >
      <HomeIcon
        title={props.title}
        onClick={onClick}
        state={collapse}
      />
    </SideBar>
  );
};

export default NavBar;

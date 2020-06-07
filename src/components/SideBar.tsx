/* Libs */
import React, {
  useState,
  FunctionComponent,
  PropsWithChildren
} from 'react';

/* Styles */
import 'css/sidebar.scss';

/* Interfaces */
export type SideBarState = 'collapsed' | 'active';

interface SideBarProps {
  state?: SideBarState
}

export interface SideIconProps {
  onClick?: () => void
}

interface SideContentProps {}

interface SideLineProps {}

export const SideIcon: FunctionComponent<SideIconProps> = (props: PropsWithChildren<SideIconProps>) => {
  return (
    <div className='sideicon col-sm-4'>
      {props.children}
    </div>
  );
};

export const SideContent: FunctionComponent<SideContentProps> = (props: PropsWithChildren<SideContentProps>) => {
  return (
    <div className='sidecontent col-sm'>
      {props.children}
    </div>
  );
};

export const SideLine: FunctionComponent<SideLineProps> = (props: PropsWithChildren<SideLineProps>) => {
  return (
    <div className='sideline row'>
      {props.children}
    </div>
  );
};

export const useSideBar = () => {
  const [collapse, setCollapse] = useState('collapsed' as SideBarState);

  const onClick = () => {
    switch(collapse) {
      case 'collapsed':
        setCollapse('active');
        break;
      case 'active':
        setCollapse('collapsed');
        break;
      default:
        setCollapse('collapsed');
    }
  };

  return { collapse, onClick};
};

export const SideBar: FunctionComponent<SideBarProps> = (props: PropsWithChildren<SideBarProps>) => {
  return (
    <nav
      id='sidebar'
      className={['sidebar', props.state].join(' ')}
    >
      {props.children}
    </nav>
  );
};

SideBar.defaultProps = {
  state: 'collapsed'
};

export default SideBar;

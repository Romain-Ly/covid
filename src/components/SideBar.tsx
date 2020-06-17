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
    <div className='sideicon'>
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
  const [state, setCollapse] = useState<SideBarState>('collapsed');

  const onClick = () => {
    switch(state) {
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

  return { state, onClick };
};

export const SideBar: FunctionComponent<SideBarProps> = (props: PropsWithChildren<SideBarProps>) => {
  return (
    <nav
      id='sidebar'
      className={['sidebar row', props.state].join(' ')}
    >
      {props.children}
    </nav>
  );
};

SideBar.defaultProps = {
  state: 'collapsed'
};

export default SideBar;

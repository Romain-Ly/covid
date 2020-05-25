/* Libs */
import React, {
  useState
} from 'react';
import FA from 'react-fontawesome';

/* Styles */
import 'css/sidebar.scss';

/* Interfaces */
interface SideBarProps {
  title: string
  collapse?: boolean
}

interface NavBarProps extends SideBarProps {
  onClick: () => void
}

interface NavHeaderProps {
  title: string,
  onClick: () => void
  collapse?: boolean
}

//#region NavHeader

const NavFullHeader = (props: NavHeaderProps) => {
  return (
    <div
     className='row'
     onClick={props.onClick}
    >
      <div className='col-sm-8'>
        <h3>
          {props.title}
        </h3>
      </div>
      <div className='col-sm-4'>
        <button
          type="button"
          id="sidebarCollapse"
          className="btn btn-outline-light"
          onClick={props.onClick}
        >
          <FA
            className="sidebar__button__icon"
            name="chevron-circle-left"
            size="2x"
            style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
            onClick={props.onClick}
          />
        </button>
      </div>
    </div>
  );
};

const NavCollapsedHeader = (props: NavHeaderProps) => {
  return (
    <div className='sidebar__button'>
      <button
        type="button"
        id="sidebarCollapse"
        className="btn btn-outline-light"
        onClick={props.onClick}
      >
        <FA
          className="sidebar__button__icon"
          name="chevron-circle-right"
          size="2x"
          style={{ textShadow: '0 1px 0 rgba(0, 0, 0, 0.1)' }}
          onClick={props.onClick}
        />
      </button>
    </div>
  );
};

const NavHeader = (props: NavHeaderProps) => {
  return (
    <nav className='navbar navbar-dark bg-dark sidebar__header'>
      <div className='container sidebar__header'>
        {
          props.collapse ?
          <NavCollapsedHeader
            title={''}
            onClick={props.onClick}
          /> :
          <NavFullHeader
            title={props.title}
            onClick={props.onClick}
          />
        }
      </div>
    </nav>
  );
};

//#endregion

const NavBar = (props: NavBarProps) => {
  let collapse;
  if (props.collapse) {
    collapse = 'collapsed';
  } else {
    collapse = 'active';
  }

  return (
    <nav
      id='sidebar'
      className={['sidebar', collapse].join(' ')}
    >
      <NavHeader
        title={props.title}
        onClick={props.onClick}
        collapse={props.collapse}
      />
    </nav>
  );
};


const SideBar = (props: SideBarProps) => {
  const [collapse, setCollapse] = useState(props.collapse);

  const onClick = () => {
    setCollapse(!collapse);
  };

  return (
    <NavBar
      {...props}
      collapse={collapse}
      onClick={onClick}
    />
  );
};

SideBar.defaultProps = {
  collapse: false
};

export default SideBar;

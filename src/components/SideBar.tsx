/* Libs */
import React, {
  useState
} from 'react';

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
    <div>
      <div className="sidebar-header">
        <h4>{props.title}</h4>
      </div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            type="button"
            id="sidebarCollapse"
            className="btn btn-info"
            onClick={props.onClick}
          >
            <i className="fas fa-align-left"></i>
            <span>Toggle Sidebar</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

const NavCollapsedHeader = (props: NavHeaderProps) => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            type="button"
            id="sidebarCollapse"
            className="btn btn-info"
            onClick={props.onClick}
          >
            <i className="fas fa-align-left"></i>
          </button>
        </div>
      </nav>
    </div>
  );
};

const NavHeader = (props: NavHeaderProps) => {
  return (
    <div>
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

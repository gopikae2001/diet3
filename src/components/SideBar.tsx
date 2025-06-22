import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";
// import { GraphIcon } from '@primer/octicons-react'
// import { PlusCircleIcon } from '@primer/octicons-react'
// import { ListUnorderedIcon } from '@primer/octicons-react'
// import { ReportIcon } from '@primer/octicons-react'
// import { ShieldCheckIcon } from '@primer/octicons-react'
// import { FileDirectoryIcon } from '@primer/octicons-react'
// import { LocationIcon } from '@primer/octicons-react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
// import sidebarLogo from '../assets/sidebarlogo.png';
import sidebarLogo from '../assets/sidebarlogo.jpg';
// import sidebarLogo from "../assets/sidebar-logo.jpg";

interface SideBarProps {
  collapsed?: boolean;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed = false }) => {
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-content">
        <div className="sidebar-top">
          <a
            href=""
            className={`sidebar-profile ${collapsed ? "collapsed" : ""}`}
          >
            <img src={sidebarLogo} alt="" />
          </a>
          <div className="sidebar-text">
            <h6 className="sidebar-heading">System Admin</h6>
            <h4 className="sidebar-para">HODO Hospital,</h4>
            <p className="sidebar-para">Kazhakkottam</p>
            <p className="sidebar-para2">System Admin</p>
          </div>
        </div>
        <div className={`searchbar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-date">
            <h6 className="sidebar-date-heading">
              @Anchal {new Date().toLocaleDateString()}
            </h6>
          </div>
          <input
            type="text"
            className="searchbar"
            placeholder="Search Menu- Ctrl + M"
          />
        </div>
      </div>
      <nav>
        <ul>
          <li className="sidebar-title">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "sidebar-heading2 active" : "sidebar-heading2"
              }
              title="Diet Plan"
            >
              Diet Plan
            </NavLink>
          </li>
          <ul className="sidebar-sublist">
          <li>
              <NavLink
                to="/fooditem" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Food Item" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Food Item"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dietpackage" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Diet Package" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Diet Package"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dietorder" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Diet Order" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Diet Order"}
              </NavLink>
            </li>
           
            <li>
              <NavLink
                to="/dietician" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Dietician" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Dietician"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/canteen"
                style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Canteen" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Canteen"}
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/claims" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Claims" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Claims"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/location" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Vehicle Location" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Vehicle Location"}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/driver" style={{fontWeight:400,color:"#cccccc"}}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                title={collapsed ? "Driver Management" : ""}
              >
                <span>
                  <FontAwesomeIcon icon={faCaretRight} />
                </span>
                {!collapsed && "Driver Management"}
              </NavLink>
            </li> */}
          </ul>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;

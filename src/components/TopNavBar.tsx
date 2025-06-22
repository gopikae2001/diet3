import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Topnavbar.css';
import logo from '../assets/logo.png';
import { Plus } from 'lucide-react';

const TopNavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="top-navbar">
      <div className="navItem">
        <a href=""><img src={logo} alt="Logo" /></a>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        <div className={`nav-links-container${menuOpen ? ' open' : ''}`}>
          <ul className="nav-list2">
            <li className='nav-link'>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ fontSize: '14px', fontWeight: 400,color:'#cccccc' }}
              >
                Dashboard
              </NavLink>
            </li>
            <li className='nav-link'>
              <NavLink
                to="/insurance"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ fontSize: '14px', fontWeight: 400,color:'#cccccc' }}
              >
                Billing
              </NavLink>
            </li>
            <li className='nav-link'>
              <NavLink
                to="/documents"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ fontSize: '14px', fontWeight: 400,color:'#cccccc' }}
              >
                Pharmacy
              </NavLink>
            </li>
            <li className='nav-link'>
              <NavLink
                to="/documents"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ fontSize: '14px', fontWeight: 400,color:'#cccccc' }}
              >
                Appointments
              </NavLink>
            </li>
            <li className='dropdown'>
              <NavLink
                to="/documents"
                className={({ isActive }) => isActive ? 'active' : ''}
                style={{ fontSize: '14px', fontWeight: 400,color:'#cccccc' }}
              >
                More <i className="fas fa-caret-down" style={{fontSize:'12px',marginLeft:'4px'}}></i>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className={`nav-right${menuOpen ? ' open' : ''}`}>
        <ul className="nav-list">
          <div className="searchBar">
            <input type="search" name="search" className='searchBarInput' placeholder="Search Patient with Name or Card No. or Mobile No." />
          </div>
          <div className="nav-buttons">
            <li className='nav-list-button'><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''} style={{fontWeight:400}}>New Sale</NavLink></li>
            <li className='nav-list-button'><NavLink to="/register-vehicle" className={({ isActive }) => isActive ? 'active' : ''} style={{fontWeight:400}}> <Plus size={16} /> Add Patient</NavLink></li>
          </div>
          <div className="nav-div-main">
            <div className="nav-div">
              <a href="/vehicle-list" className="nav-link text-white" title="Vehicle List">
                <i className="fa-solid fa-magnifying-glass "></i>
              </a>
            </div>
            <div className="nav-div">
              <a href="#" className="nav-link text-white" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                alert('Notification feature coming soon!');
              }}>
                <i className="fas fa-bell  mt-1"></i>
              </a>
            </div>
            <div className="nav-div">
              <a href="#" className="nav-link text-white" onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                alert('Settings Disabled');
              }}>
                <i className="fas fa-cog  mt-1"></i>
              </a>
            </div>
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default TopNavBar; 
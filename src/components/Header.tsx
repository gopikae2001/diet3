import React, { useState, useEffect } from 'react';
import '../styles/Header.css';
// import { ChevronLeftIcon, ChevronRightIcon } from '@primer/octicons-react';
import leftarrow from '../assets/lefthand.png';
import rightarrow from '../assets/righthand.png';
// import { Calendar, Clock, Calculator } from 'lucide-react';

interface HeaderProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarCollapsed, toggleSidebar }) => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    const currentDateObj = new Date();
    const day = currentDateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const date = currentDateObj.getDate();
    const month = currentDateObj.toLocaleDateString('en-US', { month: 'short' });
    const year = currentDateObj.getFullYear();
    const currentDate = `${day} ${date} ${month} ${year}`;

    const formattedTime = currentTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup timer on component unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className='header-container'>
            <button
                className="sidebar-toggle-btn"
                onClick={toggleSidebar}
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
                {sidebarCollapsed ? <img src={rightarrow} alt="leftarrow" /> : <img src={leftarrow} alt="rightarrow" />}
            </button>
            <h1></h1>
            <div className="header-div">
                <div className="icons-div">
                    <div className="icon-item">
                        {/* <Calendar size={25} className='header-icon' /> */}
                        <i className="header-icon fa-solid fa-calendar-days"></i>
                        <span className='header-span'>{currentDate}</span>
                    </div>
                    <div className="icon-item">
                        {/* <Clock size={25} className='header-icon' /> */}
                        <i className="header-icon fa-solid fa-clock custom-clock"></i>
                        <span className='header-span'>{formattedTime}</span>
                    </div>
                    <div className="icon-item">
                        {/* <Calculator size={25} className='header-icon' /> */}
                        <i className="header-icon fa-solid fa-calculator"></i>
                        {/* <span>Calculator</span> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header; 
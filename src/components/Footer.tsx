import React from 'react';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: Error) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className='footer-container'>
      <div className="footer-left">
        <span> © 2025 </span>
        <a href="#">www.hodo.com</a>
        <span>Empowering Entrepreneurs in Healthcare </span>
        <a href="#">Short Cuts</a>
      </div>
      <div className="footer-right">
        <button onClick={toggleFullscreen} className="fullscreen-btn">
          ⛶
        </button>
      </div>
    </div>
  );
};

export default Footer; 
import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../styles/Footer.css';
import '../styles/ShortcutsModal.css';

const ShortcutsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="shortcuts-modal">
        <div className="modal-header">
          <h2>Shortcut Keys</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>
        
        <div className="shortcut-section">
          <h3>GENERAL SHORTCUTS</h3>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + CTRL + L</div>
            <div className="shortcut-description">= Log out or login</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + S</div>
            <div className="shortcut-description">= Search Patient (Clear and search if patient selected)</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + R</div>
            <div className="shortcut-description">= Register patient</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + H</div>
            <div className="shortcut-description">= Visit History (After patient selected)</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + A</div>
            <div className="shortcut-description">= Assign Doctor/Lab Tests (After patient selected)</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + F</div>
            <div className="shortcut-description">= Add Pending Lab Result</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + J</div>
            <div className="shortcut-description">= Add Pending Radiology Result (After patient selected)</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + U</div>
            <div className="shortcut-description">= Add Pending Procedure Result (After patient selected)</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + Z</div>
            <div className="shortcut-description">= View Lab Entered Results</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + Y</div>
            <div className="shortcut-description">= Home collection registration</div>
          </div>
        </div>

        <div className="shortcut-section">
          <h3>FUNCTION KEYS</h3>
          <div className="shortcut-item">
            <div className="shortcut-keys">F1</div>
            <div className="shortcut-description">= Search</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F2</div>
            <div className="shortcut-description">= Todays Bills</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F3</div>
            <div className="shortcut-description">= Todays Visits</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">CTRL + F2</div>
            <div className="shortcut-description">= Collect Sample</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F4</div>
            <div className="shortcut-description">= Appointments</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F6</div>
            <div className="shortcut-description">= Drug Stocks</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">ALT + F6</div>
            <div className="shortcut-description">= Brand Name wise Stock</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">CTRL + F6</div>
            <div className="shortcut-description">= Stock transfer</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F7</div>
            <div className="shortcut-description">= Pharmacy Sale</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">CTRL + F7</div>
            <div className="shortcut-description">= Pharmacy Sale Return</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F8</div>
            <div className="shortcut-description">= Register Patient</div>
          </div>
          <div className="shortcut-item">
            <div className="shortcut-keys">F9</div>
            <div className="shortcut-description">= New Visit</div>
          </div>
        </div>
      </div>
    </>
  );
};

const Footer: React.FC = () => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleFullscreen = (): void => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err: Error) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleShortcuts = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowShortcuts(!showShortcuts);
  };

  return (
    <>
      <div className='footer-container'>
        <div className="footer-left">
          <span>© 2025 </span>
          <a href="#">www.hodo.com</a>
          <span>Empowering Entrepreneurs in Healthcare </span>
          <a href="#" onClick={toggleShortcuts}>Short Cuts</a>
        </div>
        <div className="footer-right">
          <button onClick={toggleFullscreen} className="fullscreen-btn" aria-label="Toggle fullscreen">
            ⛶
          </button>
        </div>
      </div>
      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </>
  );
};

export default Footer;
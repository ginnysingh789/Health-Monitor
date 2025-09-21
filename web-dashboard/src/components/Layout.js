import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Layout = ({ navigationItems }) => {
  return (
  <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🏥 Health Monitor Dashboard</h1>
            <p className="subtitle">Educational Project - Simulated Data Only</p>
          </div>
          <div className="header-right">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <nav className="app-navigation">
        <div className="nav-container">
          {navigationItems && navigationItems.map(item => (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className="nav-item"
              end={item.id === 'dashboard'}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="app-main">
        <div className="content-area">
          <Outlet />
        </div>
      </main>

      <footer className="app-footer">
        <p>⚠️ Educational Use Only - Not for Medical Diagnosis</p>
      </footer>
    </div>
  );
};

export default Layout;

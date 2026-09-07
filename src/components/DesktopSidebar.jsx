import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  HomeIcon,
  PlusCircleIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/solid';

export default function DesktopSidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="desktop-sidebar">
      <div className="sidebar-brand">
        <h1 className="brand-logo">LedgerLines</h1>
      </div>
      
      <nav className="sidebar-nav" aria-label="Desktop Navigation">
        <NavLink to="/" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`} end>
          <HomeIcon className="icon-md" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/add" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}>
          <PlusCircleIcon className="icon-md text-blue" />
          <span>Add Transaction</span>
        </NavLink>
        
        <NavLink to="/summary" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}>
          <ChartPieIcon className="icon-md" />
          <span>Summary</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}>
          <Cog6ToothIcon className="icon-md" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button className="btn-secondary w-full" type="button" onClick={toggleTheme} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {theme === 'dark' ? <SunIcon className="icon-md text-yellow" /> : <MoonIcon className="icon-md text-blue" />}
          <span style={{ marginLeft: '8px' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  PlusCircleIcon,
  ChartPieIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import './BottomNav.css';

export default function BottomNav() {
  return (
    <nav className="floating-nav" aria-label="Main Navigation">
      <div className="floating-nav-pill">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
          end
        >
          <HomeIcon className="nav-icon" />
          <span className="nav-label">Home</span>
        </NavLink>

        <NavLink
          to="/add"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <PlusCircleIcon className="nav-icon nav-icon-plus" />
          <span className="nav-label">Add</span>
        </NavLink>

        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <ChartPieIcon className="nav-icon" />
          <span className="nav-label">Summary</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'nav-item-active' : ''}`
          }
        >
          <Cog6ToothIcon className="nav-icon" />
          <span className="nav-label">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}

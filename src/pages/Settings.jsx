import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

export default function Settings() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="page-container">
      <header className="page-header">
        <h1 className="page-title">Settings</h1>
      </header>

      <section className="card">
        <header className="section-header">
          <div className="tx-info">
            <h2 className="section-title">App Theme</h2>
            <span className="tx-category">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button className="btn-secondary" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <SunIcon className="icon-md text-yellow" />
            ) : (
              <MoonIcon className="icon-md text-blue" />
            )}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </header>
      </section>
    </main>
  );
}

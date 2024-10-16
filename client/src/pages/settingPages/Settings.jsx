import React from 'react'
import SettingSidebar from '../../components/SettingSidebar';
import { Outlet } from 'react-router-dom';
import './Settings.css'

export default function Settings() {
  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <SettingSidebar />
      </div>
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
}

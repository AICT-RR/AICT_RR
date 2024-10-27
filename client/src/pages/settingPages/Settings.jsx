import React from 'react';
import SettingSidebar from '../../components/SettingSidebar';
import TopBar from '../../pages/settingPages/TopBar';
import { Outlet } from 'react-router-dom';
import './Settings.css';

export default function Settings() {
  return (
    <div>
      <TopBar />
      <div className='settings-container'>
        <div className='settings-sidebar'>
          <SettingSidebar />
        </div>
        <div className='settings-content'>
          <Outlet />
        </div>
        <div className='settings-container'>
          
        </div>
      </div>
    </div>
  );
}

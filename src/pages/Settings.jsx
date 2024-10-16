import React from 'react'
import './SlideScreen.css';
import SettingSidebar from '../components/SettingSidebar';
import { Outlet } from 'react-router-dom';

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <SettingSidebar />
      <Outlet />
    </>
  )
}

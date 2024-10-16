import React from 'react'
import SettingSidebar from '../../components/SettingSidebar';
import { Outlet } from 'react-router-dom';
import Uploader from '../../components/Uploader';

export default function Settings() {
  return (
    <>
      <h1>Settings</h1>
      <SettingSidebar />
      <Uploader />
      <Outlet />
    </>
  )
}

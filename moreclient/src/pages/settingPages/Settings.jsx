import React from 'react'
import SettingSidebar from '../../Component/SettingSidebar';

import FileUpload from '../../Component/FileUpload';
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

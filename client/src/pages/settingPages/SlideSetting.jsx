import React from 'react'
import Uploader from '../../components/FileUpload';
import './SubSetting.css'

export default function SlideSetting() {
  return (
    <div className='settingArea'>
      <h1 className='settingTitle'>SlideSetting</h1>
      <Uploader />
    </div>
  )
}
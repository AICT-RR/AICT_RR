import React from 'react'
import Uploader from '../../components/FileUpload';
import './SubSetting.css'

export default function SlideSetting() {
  return (
    <div className='settingArea'>
      <h1 className='settingTitle'>슬라이드 선택</h1>
      <Uploader />
    </div>
  )
}
import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main';
import DisplaySetting from './pages/settingPages/DisplaySetting';
import Settings from './pages/settingPages/Settings';
import SlideSetting from './pages/settingPages/SlideSetting';
import { Navigate,BrowserRouter, Routes, Route } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/setting" element={<Settings />}>
        <Route index element={<Navigate to="slide" replace />} /> {/* 기본 경로에서 /setting/slide로 리다이렉트 */}
        <Route path="slide" element={<SlideSetting />} /> {/* /setting/slide */}
        <Route path="display" element={<DisplaySetting />} /> {/* /setting/display */}
      </Route>
    </Routes>
    </BrowserRouter> 

);


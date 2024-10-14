import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FileUpload from './Component/FileUpload';
import TabPanel from './Component/TabPanel';
import Main from './main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/setting" element={<FileUpload />} />
      </Routes>
    </BrowserRouter> 

);


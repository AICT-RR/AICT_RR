import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './SettingSidebar.css';

export default function SettingSidebar() {
  return (
    <div>
      <h1 className='brandtitle'>Babara</h1>
      <nav>
        <ul>
          <li>
          <NavLink to='slide' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <div className='nav-item'>
              <div className='nav-deco'></div>
              <div className='nav-text'>슬라이드 관리</div>
            </div>
          </NavLink>

          <NavLink to='display' 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            <div className='nav-item'>
              <div className='nav-deco'></div>
              <div className='nav-text'>화면 관리</div>
            </div>
          </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

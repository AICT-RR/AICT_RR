import React from 'react';
import { NavLink } from 'react-router-dom';
import './SettingSidebar.css';

import { ReactComponent as TransitionIcon } from '../icons/fluent--slide-settings-24-regular.svg';
import { ReactComponent as SlidesIcon } from '../icons/fluent--slide-multiple-24-regular.svg';


export default function SettingSidebar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink
              to='slide'
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <div className='nav-item'>
                <SlidesIcon className='img-icons' />
                <div className='nav-text'>슬라이드</div>
              </div>
            </NavLink>
          </li>
          <li>
            <NavLink
              to='display'
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              <div className='nav-item'>
                <TransitionIcon className='img-icons'/>
                <div className='nav-text'>전환 설정</div>
              </div>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

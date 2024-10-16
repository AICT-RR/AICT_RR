import React from 'react'
import { Link } from 'react-router-dom'
import './SettingSidebar.css'

export default function SettingSidebar() {
  return (
    <div>
      <h1>sidebar</h1>
      <nav>
        <ul>
            <li>
                <Link to="slide">slide</Link>
            </li>
            <li>
                <Link to="display">display</Link>
            </li>
        </ul>
      </nav>
    </div>
  )
}

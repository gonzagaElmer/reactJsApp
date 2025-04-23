import React from 'react'
import { Link } from 'react-router-dom'
import { ACTIVE_TAB, DEACTIVATED_TAB } from '../config/constants';

function HomeTabs({currentTab}) {
    const activeStudentsIsActive = currentTab === ACTIVE_TAB ? "active text-decoration-none" : "";
    const inactiveStudentsIsActive = currentTab === DEACTIVATED_TAB ? "active text-decoration-none" : "";

  return (
    <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
                <Link to='/' className={`nav-link ${activeStudentsIsActive}`}>Active students</Link>
            </li>
            <li className="nav-item">
                <Link to='/deactivated' className={`nav-link ${inactiveStudentsIsActive}`}>Deactivated students</Link>
            </li>
        </ul>
    </div>
  )
}

export default HomeTabs
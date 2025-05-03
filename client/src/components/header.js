import React from 'react';
import './header.css';

function Header() {
    return (
        <header className = 'header'>
            <h1 className = 'header-title'>CP Buddy 👶🏝️</h1>
            <h2 className = 'header-subtitle'>Your Companion for Course Management</h2>
            <nav className = 'header-nav'>
                <ul className = 'header-nav-list'>
                    <li className = 'header-nav-item'>Home</li>
                    <li className = 'header-nav-item'>Courses</li>
                    <li className = 'header-nav-item'>Assignments</li>
                    <li className = 'header-nav-item'>Grades</li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;
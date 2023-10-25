import React from 'react';
import './../App.css';

const header = ({ onSignInClick, onSignUpClick }) => {
    return <div>
        <nav className='header'>
            <div className="header-logo">
                <h5>Task Manager</h5>
            </div>
            <div className="header-button">
            <button onClick={onSignInClick}>Sign In</button>
            <button onClick={onSignUpClick}>Sign Up</button>
            </div>
        </nav>
    </div>
};

export default header;
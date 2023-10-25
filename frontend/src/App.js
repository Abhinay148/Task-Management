import React, { useState } from 'react';
import './App.css';
import Signin from './components/signin';
import Signup from './components/signup';
import Header from './components/header';

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowSignUp(false);
  };

  const handleSignUpClick = () => {
    setShowSignIn(false);
    setShowSignUp(true);
  };

  return (
    <div>
      <Header onSignInClick={handleSignInClick} onSignUpClick={handleSignUpClick} />
      <div className='hello'>
        {showSignIn && <Signin />}
        {showSignUp && <Signup />}
        {!showSignIn && !showSignUp && (
          <>
            <h1>Welcome!</h1>
            <h2>Manage Your Tasks</h2>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

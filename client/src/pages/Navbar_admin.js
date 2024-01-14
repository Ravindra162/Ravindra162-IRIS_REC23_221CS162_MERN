import React from 'react';
import logo from './IRIS.png';
import userlogo from './userIcon.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar_admin(params) {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Remove the token from local storage
    localStorage.removeItem('token');
    
    // Redirect the user to the login page after logout
    navigate('/login');
  };

  return (
    <div>
      <nav className='Navbar'>
        <h4 style={{ position: 'relative', left: '10px' }}>
          <img style={{ height: '30px' }} src={logo} alt="IRIS Logo" />
        </h4>
        <div className='profile'>
          <h4><Link to='/admin' onClick={params.handleProfile}><img style={{ height: '30px' }} src={userlogo} alt="User Logo" /></Link></h4>
          <h4><Link to='/login' onClick={handleLogout}>Logout</Link></h4>
        </div>
      </nav>
    </div>
  );
}

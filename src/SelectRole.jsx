// SelectRole.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Banavbar from './banavbar'; // Make sure the path is correct and the file is named `banavbar.jsx`

const SelectRole = () => {
  const navigate = useNavigate();

  return (
    <>
      <Banavbar />
      <div className="login-container">
        <div className="login-box">
          <h2>Select Role</h2>
          <button onClick={() => navigate('/user-login')}>User</button>
          <button onClick={() => navigate('/admin-login')} style={{ marginTop: '10px' }}>Admin</button>
        </div>
      </div>
    </>
  );
};

export default SelectRole;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar_student from './Navbar';
import { useDispatch, useSelector } from 'react-redux';


const Profile = () => {
  const [present, setPresent] = useState(false);
  const [user,setUser] =  useState('')

  useEffect(() => {
    axios
      .get('http://localhost:5000/getUser', {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.data === 'An error occured') {
          toast('Bad request. Please login to view this page');
        } else {
          console.log(response.data);
          setUser(response.data)
          setPresent(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div>
      <center>
        <h2 style={{ margin: '2em' }}>
          <strong>Your profile</strong>
        </h2>
      </center>
      {present ? (
        <center>
          {/* Content to display when present is true */}
          <div style={{padding:'20px', backgroundColor:'rgb(41,105,216)',width:'fit-content'}}>
            <h5 style={{padding:'20px'}}>User Rollno    : {user ? user.rollno : 'Not found'}</h5>
            <h5 style={{padding:'20px'}}>User department: {user ? user.department: 'Not found'}</h5>
            <h5 style={{padding:'20px'}}>User position: {user ? user.position: 'Not found'}</h5>
          </div>
        </center>
      ) : (
        <center>
          {/* Content to display when present is false */}
          <div>
            {/* You can add a loading indicator or any other message */}
            <p>Loading...</p>
          </div>
        </center>
      )}
    </div>
  );
};

export default Profile;

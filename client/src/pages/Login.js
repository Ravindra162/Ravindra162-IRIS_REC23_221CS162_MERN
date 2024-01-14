import React, { useState } from 'react';
import img from './IRIS.png';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate()
  const [position, setPosition] = useState('');
  const [rollno, setRollno] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post('http://localhost:5000/login', { position, rollno, password })
      .then((data) => {
        console.log(data.data.message);
        if (data.data.message === 'Successful') {
          toast('Log In success');
          const token = data.data.token;
          
          // Set the Authorization header for all Axios requests
          console.log(token)
         
          localStorage.setItem('token', token);
          if(position==='student')
          navigate('/')
        else if(position==='MIS') navigate('/admin')
        else if (position==='DEAN') navigate('/dean')

        } else if (data.data.message === 'wrong password') {
          toast('Incorrect password');
        } else {
          toast('No user Found');
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
        toast('Login failed');
      });
  };

  return (
    <div>
      <div className='main'>
        <div className='Logodiv'>
          <img src={img} alt='IRIS-NITK' />
        </div>
        <div className='formContainer'>
          <form method='post' className='LoginForm' onSubmit={handleSubmit}>
            <input
              required={true}
              onChange={(response) => {
                setPosition(response.target.value);
              }}
              style={{
                height: '30px',
                width: '190px',
                borderColor: 'rgb(150, 162, 200)',
                borderRadius: '5px',
              }}
              placeholder='Position'
            />
            <input
              required={true}
              onChange={(response) => {
                setRollno(response.target.value);
              }}
              style={{
                height: '30px',
                width: '190px',
                borderColor: 'rgb(150, 162, 200)',
                borderRadius: '5px',
              }}
              placeholder='Roll number or ID'
            />
            <input
              required={true}
              onChange={(response) => setPassword(response.target.value)}
              type='password'
              style={{
                height: '30px',
                width: '190px',
                borderColor: 'rgb(150, 162, 200)',
                borderRadius: '5px',
              }}
              placeholder='Password'
            />
            <div>
              <h6 className='message'>{errorMessage}</h6>
            </div>
            <button>Log in</button>
          </form>
          <Link to='/register'>
            <h4 style={{color:'#7B8FEA'}}>Don't have an account ?</h4>
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;

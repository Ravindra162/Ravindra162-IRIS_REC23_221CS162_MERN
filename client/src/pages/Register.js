import React ,{useState} from 'react'
import {Link} from 'react-router-dom'
import img from './IRIS.png'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Register = () => {
    const [name,setName] = useState('')
    const [position,setPosition] = useState('')
    const [rollno, setRollno] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department,setDepartment] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const handleSubmit = (e)=>{
          e.preventDefault()
          if(password===confirmPassword){
          console.log(position,rollno,password,department)
          axios.post('http://localhost:5000/register',{position,rollno,password,department}).then(data=>toast(data.data))
          .catch(err=>console.log(err))
          }
        else {
          toast("misMatch password")
        }}
  return (
    <div className='main'>
      <div className="Logodiv">
        <img src={img} alt="IRIS-NITK" />
      </div>
      <div className='formContainer'>
        <form method='post' className='LoginForm' onSubmit={handleSubmit}>
        <input
            required={true}
            onChange={(response) => {setPosition(response.target.value)
            }}
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Position'
          />
          <input
            required={true}
            onChange={(response) => {
                setRollno(response.target.value)
            }}
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Roll number or Identity'
          />
          {position==='student'&&<select   style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }} onChange={(event)=>{
      setDepartment(event.target.value)
    }} id="serviceType" name="serviceType" required>
      <option value=""><strong>Select branch:</strong></option>
      <option value="CSE">CSE</option>
      <option value="ECE">ECE</option>
      <option value="IT">IT</option>
      <option value="EEE">EEE</option>
    </select>}
          <input
            required={true}
            onChange={(response) => setPassword(response.target.value)}
            type="password"
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Password'
          />
          <div>
            <input
              required={true}
              onChange={(response) => setConfirmPassword(response.target.value)}
              type="password"
              style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
              placeholder='Confirm Password'
            /><br/>   
            <h6 className='message'>{errorMessage}</h6>
          </div>
          <button>Register</button>
        </form>
        <Link to="/login"><h4>Already registered?</h4></Link>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Register

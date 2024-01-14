import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar_admin from './Navbar_admin';
import {useDispatch,useSelector} from 'react-redux'
import { SetUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
export default function Home() {
  const navigate = useNavigate()
  const {user} =useSelector((state)=>state.users)
  const [rollno,setRollno] = useState('')
  const [service,setService]= useState('')
  const [reason,setReason] = useState('')
  const [minor,setMinor] = useState('')
  const [department,setDepartment] = useState('')
  const [fa,setfa] = useState('')
  const [present,setPresent] = useState(false)
  const [profile,setProfile] = useState({})
  const [showRejectionBox, setShowRejectionBox] = useState(false);
const [rejectionReason, setRejectionReason] = useState('');

  const dispatch = useDispatch()
  useEffect(() => {
    axios.get('http://localhost:5000/getUser/admin', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then((response) => {
      if(response.data==='An error occured'){
        toast('Bad request Please login to view this page')
        
      }
      else if(response.data==='Not allowed'){
        toast('Not Authorised to view this page')
        navigate('/')
       
      }
      else{
      console.log(response.data);
      dispatch(SetUser(response.data));
      if(response.data.position==='MIS')
      setPresent(true)
    else toast("Not allowed")}
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);
  const fetchUserData = () => {

    axios.get('http://localhost:5000/getUser/admin', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then((response) => {
      if (response.data === 'An error occurred') {
        toast('Bad request. Please login to view this page');
      } else if (response.data === 'Not allowed') {
        toast('Not Authorized to view this page');
      } else {
        console.log(response.data);
        dispatch(SetUser(response.data));
        if (response.data.position === 'MIS') {
          setPresent(true);
        }
        else if(response.data.position ==='DEAN')
        navigate('/dean')
      else if(response.data.position === 'student')
      navigate('/') 
        else {
          toast('Not allowed');
          navigate('/login')
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
  };
  useEffect(() => {
    fetchUserData();

    const interval = setInterval(() => {
      fetchUserData();
    }, 2000); 

    return () => {

      clearInterval(interval);
    };
  }, []);
  const openProfile = (e) =>{
    setProfile(user)
    document.getElementById('myDiv-profile-admin').style.display='flex'
    document.getElementById('myDiv-profile-admin').style.flexDirection='column'
    document.getElementById('myDiv-profile-admin').style.alignItems='center'

}
const handleForwardClick = (requestData) => {
  
  console.log('Forwarded Request Data:', requestData);
  axios.post('http://localhost:5000/admin/forward',requestData,{
    headers:{
      'x-access-token':localStorage.getItem('token')
    }
  }).then((data)=>{
     toast(data.data)
  }).catch(err=>console.log(err))
  
};
const handleRejectClick = (data) => {
  setRollno(data.rollno)
  setService(data.service)
  setMinor(data.minor)
  setDepartment(data.department)
  setShowRejectionBox(true);
  setfa(data.fa)
  document.body.classList.add('blur-background');
};
const submitRejection = () => {
  axios.post(
      'http://localhost:5000/admin/forward',
      { service:service,rollno:rollno,message: 'rejected',minor:minor,department:department,fa:fa, reason: rejectionReason }, // Include the rejection reason in the request
      {
        headers: {
          'x-access-token': localStorage.getItem('token')
        }
      }
    )
    .then((data) => toast(data.data))
    .catch((err) => console.log(err));
  setShowRejectionBox(false);
  document.body.classList.remove('blur-background');
};
const cancelRejection = () => {
  setShowRejectionBox(false);
};
const closeProfile = (e)=>{
  e.preventDefault()
  document.getElementById('myDiv-profile-admin').style.display='none'
 }
  return (
    <div>
      {present && (
        <div>
          <Navbar_admin handleProfile={openProfile}/>
          Welcome
          {user.rollno ? user.rollno : user.Identity}
          <h5>Total request: {user.requests.length?user.requests.length : 0}</h5>
          <div className='Admin-received-box'>
          {user.requests.map((request, index) => (
        <div className="Admin-received" key={index}>
          <h2>Request {index + 1}:</h2>
          <p>Roll No: {request.rollno}</p>
          <p>Service: {request.service}</p>
          <p>Minor: {request.minor}</p>
          <p>Fac.Advisor: {request.fa}</p>
          <p>Reason: {request.reason}</p>
          <button style={{display:'inline'}}  onClick={() => handleForwardClick(request)} className='forward'>Forward</button>
          <button style={{display:'inline'}} onClick={()=>handleRejectClick(request)} className='reject'>reject</button>
        </div>
      ))}</div>
        </div>
      )}
      <div id="myDiv-profile-admin" style={{display: 'none',position:'absolute'}}>
    <div style={{display:'flex',padding:'20px',flexDirection:'column',alignItems:'center',gap:'50px',height:'300px',width:'300px'}}>
      <h3>rollno:{JSON.stringify(profile.Identity)}</h3>
     <h3> position:{JSON.stringify(profile.position)}</h3>
     <button id="closeDiv-profile" onClick={closeProfile}>Close</button>
    </div>
    
    
</div>
{showRejectionBox && (
      <div className="modal">
        <div className="modal-content">
          <textarea
            placeholder="Enter reason for rejection"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <button onClick={submitRejection}>Submit</button>
          <button onClick={cancelRejection}>Cancel</button>
        </div>
      </div>
    )}
      <ToastContainer/>
    </div>
  );
}

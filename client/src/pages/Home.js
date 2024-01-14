import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar_student from './Navbar';
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
  const [fa,setFa] = useState('')
  const [present,setPresent] = useState(false)
  const [reqContent,setReqContent] = useState([])
  const [profile,setProfile] = useState({})
  const dispatch = useDispatch()
  useEffect(() => {
    axios.get('http://localhost:5000/getUser/student', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then((response) => {
      if(response.data==='An error occured'){
        toast('Bad request Please login to view this page')
        navigate('/login')
      }
      else if(response.data==='Not allowed'){
        toast('Not authorized to view this page')
        navigate('/admin')
      }
      else{
      console.log(response.data);
      dispatch(SetUser(response.data));
      if(response.data.position==='student')
      setPresent(true)
    else {toast("Not allowed to view page")
           }}
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);
  
   const handleSubmit = (e) =>{
    e.preventDefault()
    console.log(minor,user.rollno,department,fa,reason)
    if(service==='dropMinor'){
    axios.post('http://localhost:5000/dropMinor',{rollno,service,minor,department,fa,reason}).then((data)=>{
      toast(data.data)
    }).catch(err=>console.log(err))}
   }
   const openRequests = (e) =>{
         e.preventDefault()
         axios.get('http://localhost:5000/requestData',{
          headers:{
            'x-access-token':localStorage.getItem('token')
          }
         }).then((data)=>{
           console.log(data.data)
           setReqContent(data.data)
         })
         document.getElementById('myDiv').style.display='block'
   }
   const openProfile = (e) =>{
         setProfile(user)
         document.getElementById('myDiv-profile').style.display='flex'
         document.getElementById('myDiv-profile').style.flexDirection='column'
         document.getElementById('myDiv-profile').style.alignItems='center'

   }
   const closeRequests = (e)=>{
    e.preventDefault()
    document.getElementById('myDiv').style.display='none'
   }
   const closeProfile = (e)=>{
    e.preventDefault()
    document.getElementById('myDiv-profile').style.display='none'
   }
  return (
    <div className='Main-container'>
      {present && (
        <div>
          <Navbar_student handleRequests={openRequests} handleProfile={openProfile}/>
          Hello -- 
          {user.rollno ? user.rollno : user.Identity}
          <form className="serviceRequestForm" method='post' onSubmit={handleSubmit}>
    <div>
    <label for="serviceType"><strong>Select Service:</strong></label>
    </div>
    <div>
    <select style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }} onChange={(event)=>{
      setService(event.target.value)
      setRollno(user.rollno)
    }} id="serviceType" name="serviceType" required>
      <option value=""><strong>Select Service:</strong></option>
      <option value="dropMinor">Drop Minor</option>
      <option value="Bonafide Certificate">Bonafide Certficate</option>
    </select>
    </div>{
      service==='dropMinor'&&
    <div ><div  className='Minor-template' >
     <input
            required={true}
            onChange={(response) => {
                setMinor(response.target.value)
            }}
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Enter your Minor department'
          />
     <input
            required={true}
            onChange={(response) => {
              setDepartment(response.target.value)
            }}
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Name of Parent department'
          />
     <input
            required={true}
            onChange={(response) => {
              setFa(response.target.value)
            }}
            style={{ height: "30px", width: "190px", borderColor: 'rgb(150, 162, 200)', borderRadius: "5px" }}
            placeholder='Name of Faculty Advisor'
          />
    
    <textarea onChange={(event)=>{
      setReason(event.target.value)
    }} id="additionalDetails" name="additionalDetails" placeholder="Reasons for dropping" rows="4" cols="50"></textarea>
    <div className='flow'>
    <div className="box" id="box1">
        <p>Student</p>
    </div>
    <div className="arrow">&#8594;</div>
    <div className="box" id="box2">
        <p>MIS</p>
    </div>
    <div className="arrow">&#8594;</div>
    <div className="box" id="box3">
        <p>DEAN</p>
    </div></div>
    <div>
    <input className='studentForm' type="submit" value="Submit"/>
    </div>
    </div></div>}
    
  </form>
        </div>
      )}

      
<div id="myDiv" style={{display: 'none'}}>
{reqContent && reqContent.length > 0 ? (
    reqContent.map((req, index) => (
      <div className='Each-Service' key={index}>
        <h4>Service: {JSON.stringify(req.service)}</h4>
        <h4>Status: {JSON.stringify(req.status)}</h4>
        <h4>Service_Id: {JSON.stringify(req._id)}</h4>
        {(!req.accepted)&&<h4>Rejection-reason: {JSON.stringify(req.reason)}</h4>}
        {<h4>Start-Day: {JSON.stringify(req.requestStartTime)}</h4>}
        <h4>Application-End: {req.requestEndTime?JSON.stringify(req.requestEndTime):'Yet to be known'}</h4>
        
      </div>
    ))
  ) : (
    <div>No content available</div>
  )}
    <button id="closeDiv" onClick={closeRequests}>Close</button>
</div>
<div id="myDiv-profile" style={{display: 'none'}}>
    <div style={{display:'flex',padding:'20px',flexDirection:'column',alignItems:'center',gap:'50px',height:'300px',width:'300px'}}>
      <h3>rollno:{JSON.stringify(profile.rollno)}</h3>
     <h3> department:{JSON.stringify(profile.department)}</h3>
     <h3> position:{JSON.stringify(profile.position)}</h3>
    </div>
    <button id="closeDiv-profile" onClick={closeProfile}>Close</button>
    
</div>
      <ToastContainer/>
    </div>
  );
}

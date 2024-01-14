import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SetUser } from './redux/userSlice';
const Welcome = ({children}) => {
  const [present,setPresent] = useState(false)
  const {user} =useSelector((state)=>state.users)
    const dispatch = useDispatch()
  useEffect(() => {
    axios.get('http://localhost:5000/getUser', {
      headers: {
        'x-access-token': localStorage.getItem('token')
      }
    })
    .then((response) => {
      if(response.data==='An error occured'){
        toast('Bad request Please login to view this page')
      }
      else{
      console.log(response.data);
      dispatch(SetUser(response.data));
      setPresent(true)}
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);
   const handleSubmit = (e) =>{
    e.preventDefault()
    alert('clicked')
   }
  return (
    <div>
      {present&&children}
     
      <ToastContainer/>
    </div>
  )
}

export default Welcome

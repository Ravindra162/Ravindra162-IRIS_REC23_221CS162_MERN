import React,{useState,useEffect} from 'react'

const Welcome = () => {
    const [user,setUser] = useState(null)
    useEffect(()=>{
       axios.get('http://localhost:5000/currentUser').then((data)=>{
        console.log(data.data)
       }).catch(err=>console.log(err))
    })
  return (
    <div>
      
    </div>
  )
}

export default Welcome

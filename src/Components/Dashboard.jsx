import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Auth_Context';
import Navbar from './Navbar/Navbar';
function Dashboard() {
    const navigate = useNavigate();
    const {userData} = useContext(AuthContext);
  return (
    <>
    <div>Hello {userData.user.userName}</div>
    <Navbar />
    <button onClick={()=>{
        localStorage.removeItem("token");
        navigate("/login")
    }}>Logout</button>
    </>
  )
}

export default Dashboard
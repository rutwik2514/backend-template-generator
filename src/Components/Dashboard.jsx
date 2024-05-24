import React from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const navigate = useNavigate();
  return (
    <>
    <div>Dashboard</div>
    <button onClick={()=>{
        localStorage.removeItem("user");
        navigate("/login")
    }}>Logout</button>
    </>
  )
}

export default Dashboard
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Project_Dashboard() {
    const navigate = useNavigate();
    const { projectId } = useParams();
  return (
    <>
    <button onClick={()=>navigate(`/project/${projectId}/permissions`)}>Add Permission</button>
    <button onClick={()=>navigate(`/project/${projectId}/roles`)}>Add Role</button>
    </>

  )
}

export default Project_Dashboard
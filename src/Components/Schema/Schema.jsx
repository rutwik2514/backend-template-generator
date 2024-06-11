import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Schema() {
    const navigte = useNavigate();
    const { projectId } = useParams();
  return (
    <>
        <button onClick={()=>navigte(`/project/${projectId}/schema/create`)}>Create New Schema</button>
    </>
  )
}

export default Schema
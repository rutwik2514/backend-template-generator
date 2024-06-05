import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProjectInfo } from '../api/project';
import { ToastContainer, toast } from 'react-toastify';

function Project() {
    const { projectId } = useParams();
    const [project,setProject]=useState(false);
    const navigate = useNavigate();
    const getProjectInfo = async() =>{
        const projectInfo = await fetchProjectInfo(projectId);
        if(projectInfo.error!==null){
            toast.error("something went wrong");
            navigate("/login");
        }
        setProject(projectInfo.project)
    }
    useEffect(()=>{
        getProjectInfo();
    },[])
  return (
    <>
    <div>{project.name}</div>
    <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
    </>
  )
}

export default Project
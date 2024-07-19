import React, { useEffect, useState } from 'react'
import { fetchProjectInfo } from '../../api/project';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

function Dashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [schemas,setSchemas]=useState(false);
  const [projectName,setProjectName]=useState(false);
  const getProjectInfo = async() =>{
    const projectInfo = await fetchProjectInfo(projectId);
    console.log("project info is", projectInfo)
    if(projectInfo.error)
    {
      toast.error("Something went wrong, please try again")
      return;
    }
    setSchemas(projectInfo?.schemas)
    setProjectName(projectInfo?.project?.name)
  }

  useEffect(()=>{
    getProjectInfo();
  },[])
  return (
    <>
    <div>Project Dashboard</div>
    <p>{projectName}</p>
    <button onClick={()=> navigate(`/project/${projectId}/permissions`)}>
      Edit Permissions
    </button>
    <button onClick={()=>navigate(`/project/${projectId}/roles`)}>
      Edit Roles
    </button>
    <table>
      <thead>
          <th>Schema Name</th>
          <th>Edit</th>
          <th>Delete</th>
      </thead>
      <tbody>
      {schemas && schemas.map((schema)=>{
      return(
        <>
            <tr key={schema._id}>
              <td>
                  {schema.name}
              </td>
              <td onClick={()=>{navigate(`/project/${projectId}/${schema._id}`)}}>
                  edit
              </td>
              <td>
                  delete
              </td>

            </tr>
        </>
      )
    })}
      </tbody>
    </table>
  
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

export default Dashboard
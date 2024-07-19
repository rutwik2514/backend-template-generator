import React, { useEffect, useState } from 'react';
import { createGithubRepository, fetchProjectInfo } from '../../api/project';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Dashboard.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Loader from '../../Utils/Loader/Loader';
import { deleteSchema } from '../../api/schema';
import { AiOutlineSync } from "react-icons/ai";

function Dashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [schemas, setSchemas] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [loader,setLoader]=useState(true);
  const [githubUrl,setGithubUrl]=useState(false);

  const getProjectInfo = async () => {
    const projectInfo = await fetchProjectInfo(projectId);
    if (projectInfo.error) {
      toast.error('Something went wrong, please try again');
      return;
    }
    console.log("project info is", projectInfo)
    setSchemas(projectInfo?.schemas || []);
    setProjectName(projectInfo?.project?.name || '');
    setLoader(false)
    if(projectInfo?.project?.githubUrl !== ""){
      setGithubUrl(projectInfo?.project?.githubUrl)
    }
  };

  const handleDelete = async(projectId,schemaId) =>{
      const res = await deleteSchema(projectId,schemaId)
      if(res.error === null){
        window.location.reload();
      }
      else{
        toast.error("Something went wrong")
      }
  }

  const handleGithubClick = async() =>{
      if(githubUrl){
        window.location.href = `${githubUrl}`
      }
      else{
        const res = await createGithubRepository(projectId);
        if(res.error ===null){
          window.location.reload();
        }
        else{
          toast.error("Something went wrong")
        }
      }
  }

  const syncChanges = async()=>{
    const res = await createGithubRepository(projectId);
    if(res.error ===null){
      window.location.reload();
    }
    else{
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    getProjectInfo();
  }, [projectId]);

  return (
    <>
    {loader && <Loader /> }
      {!loader && <div className='outerContainer'>
        <div className="container projectContainer">
          <h2 style={{
            textAlign: 'center',
            color: '#333',
            marginBottom: '20px'
          }}>{projectName}</h2>
          <div>
            <button className="button" onClick={() => navigate(`/project/${projectId}/permissions`)}>
              Edit Permissions
            </button>
            <button className="button" onClick={() => navigate(`/project/${projectId}/roles`)}>
              Edit Roles
            </button>
            <button className="button" onClick={() => navigate(`/project/${projectId}/schema`)}>
              Add Schema
            </button>
            <button className="button" onClick={handleGithubClick}>
              {githubUrl && <>View Repository</>}
              {!githubUrl && <>Create Repository</>}
            </button></div>
          {!schemas.length && <center><p>You have not added any schema yet</p></center>}
          { schemas.length && <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Schema Name</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schemas.map((schema) => (
                <tr key={schema._id}>
                  <td>{schema.name}</td>
                  <td><button style={{
                    padding: '5px 10px',
                    backgroundColor: '#ffc107',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',

                  }} onClick={()=>navigate(`/project/:projectId/${schema._id}`)}>
                    <i className="fas fa-pencil-alt"></i>
                  </button></td>
                  <td ><button style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }} onClick={()=>handleDelete(projectId,schema._id)}>
                    <i className="fas fa-trash"></i>
                  </button></td>
                </tr>
              ))}
            </tbody>
          </table>}
          <div style={{width:"100%", display:"flex", justifyContent:"flex-end"}}>

          {githubUrl && <button className="btn btn-success" onClick={syncChanges}>
              Sync Changes
            </button>}
          </div>
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
            className="toast-container"
          />
        </div>
      </div>}
    </>
  );
}



export default Dashboard;

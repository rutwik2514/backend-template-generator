import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/Auth_Context';
import Navbar from './Navbar/Navbar';
import { addNewProject, fetchProjects } from '../api/project';
import ProjectCard from '../Utils/ProjectCard';
import { ToastContainer, toast } from 'react-toastify';

const projectListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
};

function Dashboard() {

  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [projectList, setProjectList] = useState(false);
  const [newProjectName,setNewProjectName]=useState("");
  const getProjects = async () => {
    const projects = await fetchProjects();
    if (projects.error == null) setProjectList(projects.projects)
    else if (projects.error !== null) {
      toast.error(projects.error)
    };
  }
  useEffect(() => {
    getProjects();
  }, [])

  const handleNewProject = async() =>{
    if(newProjectName==""){
      toast.error("Must provide project name");
    }
    const res = await addNewProject(newProjectName);
    if(res.error !== null){
      toast.error("something went wrong, please try again");
    }
    else{
      window.location.reload();
    }
    console.log("res main is", res);
  }

  return (
    <>
      <div>Hello {userData.user.userName}</div>
      <Navbar />
      <button onClick={() => {
        localStorage.removeItem("token");
        navigate("/login")
      }}>Logout</button>
      <div style={projectListStyle}>
        {projectList && projectList.map(project => (
          <ProjectCard key={project._id} project={project} projectId={project._id} />
        ))}
      </div>
      <input placeholder='new project name' value={newProjectName} onChange={(e)=>setNewProjectName(e.target.value)} />
      <button onClick={handleNewProject}>Create New project</button>
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
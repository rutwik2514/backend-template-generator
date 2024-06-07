import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewProject, fetchProjects } from '../../api/project';
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../context/Auth_Context';
import ProjectCard from '../../Utils/ProjectCard';

const projectListStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  padding: '20px',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  cursor: 'pointer',
  margin: '10px 0',
  width: '300px',
};

const inputStyle = {
  padding: '10px',
  margin: '0 10px 10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '300px',
};

function Project() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);
  const [projectList, setProjectList] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  //getting project list 
  const getProjects = async () => {
    const projects = await fetchProjects();
    if (projects.error == null) setProjectList(projects.projects)
    else if (projects.error !== null) {
      toast.error(projects.error)
    };
  };

  //adding new project
  const handleNewProject = async () => {
    if (newProjectName === '') {
      toast.error('Must provide project name');
    }
    const res = await addNewProject(newProjectName);
    if (res.error !== null) {
      toast.error('something went wrong, please try again');
    }
    else {
      window.location.reload();
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      {/* <button onClick={() => {
        localStorage.removeItem('token');
        navigate('/login');
      }}>Logout</button> */}
        <input placeholder='new project name' value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} style={inputStyle} />
        <button onClick={handleNewProject} style={buttonStyle}>Create New project</button>
      <div style={projectListStyle}>
        {projectList && projectList.map(project => (
          <ProjectCard key={project._id} project={project} projectId={project._id} />
        ))}
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
      />
    </>
  )
}

export default Project;

import React from 'react';
import { fetchProjectInfo } from '../api/project';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project,projectId }) {
  const cardStyle = {
    border: '1px solid #ccc',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '200px',
    margin: '10px'
  };
  const navigate = useNavigate();
  // console.log("key is", projectId);
  const handleClick = async(e) =>{
    let projectId = e.target.className;
    navigate(`/project/${projectId}`);
  }

  return (
    <div style={cardStyle} className={projectId} onClick={handleClick}>
      <h2 className={projectId}>{project.name}</h2>
      {/* Add more project details here if needed */}
    </div>
  );
}

export default ProjectCard;

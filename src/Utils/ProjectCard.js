import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProjectCard({ project, projectId }) {
  const cardStyle = {
    border: '1px solid #ccc',
    padding: '16px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    width: '200px',
    margin: '10px',
    overflow: 'hidden', // Ensuring text overflow behavior
  };

  const projectNameStyle = {
    fontSize: '16px', // Adjusting font size
    fontWeight: 'bold', // Making the project name bold
    margin: '0',
    whiteSpace: 'nowrap', // Preventing line breaks
    overflow: 'hidden', // Hiding overflow text
    textOverflow: 'ellipsis', // Showing ellipsis for overflow text
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${projectId}/`);
  };

  return (
    <div style={cardStyle} onClick={handleClick}>
      <h2 style={projectNameStyle}>{project.name}</h2>
      {/* Add more project details here if needed */}
    </div>
  );
}

export default ProjectCard;

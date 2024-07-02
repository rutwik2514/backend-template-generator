import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';

const inputStyle = {
  padding: '10px',
  margin: '0 10px 10px 0',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '200px',
};

function Schema() {
  const navigte = useNavigate();
  const { projectId } = useParams();
  const [newSchemaName, setNewSchemaName] = useState('');

  const handleNewSchema = async () => {
    if(newSchemaName === ''){
      toast.error("must provide schema name!");
      return;
    }
    navigte(`/project/${projectId}/schema/create/${newSchemaName}`);
  }


  return (
    <>
      <input
        placeholder='Schema Name'
        value={newSchemaName}
        onChange={(e) => setNewSchemaName(e.target.value)}
        style={inputStyle}
        type="text" />
      <button onClick={handleNewSchema}>Create New Schema</button>
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

export default Schema
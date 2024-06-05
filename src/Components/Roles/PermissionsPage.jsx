import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/Auth_Context';

const PermissionsPage = () => {
  const { permissions, setPermissions } = useContext(AuthContext);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [newPermission, setNewPermission] = useState('');
  const [editedPermission, setEditedPermission] = useState(''); 

  const handleAddPermission = () => {
    if (newPermission !== '') {
      setPermissions((prev) => ([
        ...prev,
        newPermission
      ]));
      setNewPermission('');
    }
  }

  const handleEditPermission = () => {
    if (selectedPermission && editedPermission !== '') {
      const editedPermissions = permissions.map((permission) =>
        permission === selectedPermission ? editedPermission : permission);
      setPermissions(editedPermissions);
      setSelectedPermission(null);
      setEditedPermission('');
    }
  }

  const handleSelectPermission = (permission) => {
    setSelectedPermission(permission);
    setEditedPermission(permission); 
  }
  const handleDeletePermission = (permission) => {
    setPermissions((prev)=>{
      const updatedPermissions = prev.filter((key) => key!==permission);
      return updatedPermissions;
    })
  };

  console.log(permissions);

  return (
    <div>
      <h2>List Permissions</h2>
      <div>
        <input
          type="text"
          name="permission"
          value={newPermission}
          placeholder="Add permissions"
          onChange={(e) => setNewPermission(e.target.value)}
          required
        />
        <button onClick={handleAddPermission}>Add Permission</button>
      </div>

      <div>
        <ul>
          {permissions.map((permission, index) => (
            <li key={index}>
              {selectedPermission === permission ? (
                <div>
                  <input
                    type="text"
                    value={editedPermission} 
                    onChange={(e) => setEditedPermission(e.target.value)} 
                    required
                  />
                  <button onClick={handleEditPermission}>Save</button>
                </div>
              ) : (
                <div>
                  {permission}
                  <button onClick={() => handleSelectPermission(permission)}>Edit</button>
                  <button onClick={() => handleDeletePermission(permission)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PermissionsPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllPermission } from '../../api/permissions';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProjectInfo } from '../../api/project';
import { addNewRole, deleteRole, updateRole } from '../../api/role';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const {  projectId} = useParams();

  const handleAddRole = async() => {
    if (newRoleName !== '') {
      const response = await addNewRole(newRoleName,projectId,[]);
      if(response.error){
        toast.error("Something went wrong");
        return;
      }
      setNewRoleName('');
      window.location.reload();
    }
  };

  const handleEditRole = (roleIndex, updatedRoleName) => {
    setRoles((prev) => {
      const allRoles = prev.map((role, index) => {
        if (index === roleIndex) {
          return {
            ...role,
            name: updatedRoleName
          };
        } else {
          return role;
        }
      });
      return allRoles;
    });
    setSelectedRole(null);
  };

  const handleDeleteRole = async(roleIndex) => {
    const res = await deleteRole(roles[roleIndex]._id, projectId);
    if(res.error){
      toast.error("Something went wrong");
    }
    else{
      window.location.reload();
    }
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handlePermissionChange = (roleIndex, permission) => {
    setRoles((prev) => {
      const allRoles = [...prev];
      const updatedRole = allRoles[roleIndex];

      if (updatedRole.permissions.includes(permission)) {
        updatedRole.permissions = updatedRole.permissions.filter((p) => p !== permission);
      } else {
        updatedRole.permissions.push(permission);
      }

      allRoles[roleIndex] = updatedRole;
      return allRoles;
    });
  };

  const getPermissionsAndRoles = async () => {
    try {
      const allPermissions = await getAllPermission(projectId);
      const projectInfo = await fetchProjectInfo(projectId);

      if (allPermissions.error || projectInfo.error) {
        toast.error("Something went wrong");
        return;
      }

      setPermissions(allPermissions.permissions);
      setRoles(projectInfo.project.roles);
    } catch (error) {
      console.error("Error fetching permissions and roles:", error);
    }
  };

  const handleSave = async(id,roleIndex) =>{
    const update = await updateRole(id,roles[roleIndex].name,roles[roleIndex].permissions);
    if(update.error){
      toast.error("something went wrong");
      return;
    }
    window.location.reload();
  }

  useEffect(() => {
    getPermissionsAndRoles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>RolesPage</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          id="roleName"
          name="roleName"
          value={newRoleName}
          placeholder="Role Name"
          onChange={(e) => setNewRoleName(e.target.value)}
          required
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <button onClick={handleAddRole} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Role</button>
      </div>
      {roles.map((role, roleIndex) => (
        <div key={roleIndex} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', backgroundColor: '#f9f9f9', maxWidth:"30vw" }}>
          <h3 style={{ marginBottom: '10px' }}>
            {selectedRole===roleIndex ? (
              <form onSubmit={(e) => { e.preventDefault(); handleEditRole(roleIndex, e.target.roleName.value) }}>
                <input type="text" defaultValue={role.name} name="roleName" required style={{ padding: '5px', marginRight: '10px' }} />
              </form>
            ) : (
              role.name
            )}
          </h3>
          <ul>
            {selectedRole === roleIndex && permissions.map((permission, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={role.permissions.includes(permission)}
                  onChange={() => handlePermissionChange(roleIndex, permission)}
                  style={{ marginRight: '5px' }}
                />
                {permission}
              </li>
            ))}
              {selectedRole !== roleIndex && permissions.map((permission, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  disabled
                  checked={role.permissions.includes(permission)}
                  style={{ marginRight: '5px' }}
                />
                {permission}
              </li>
            ))}
          </ul>
          {selectedRole===roleIndex ? (
            <>
            <button onClick={() => setSelectedRole(null)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Cancel</button>
            <button onClick={()=>handleSave(role._id,roleIndex)} type="submit" style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
            </>
          ) : (
            <>
              <button onClick={() => handleSelectRole(roleIndex)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
              <button onClick={() => handleDeleteRole(roleIndex)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </>
          )}
        </div>
      ))}
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
    </div>
  );
};

export default RolesPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAllPermission } from '../../api/permissions';
import { ToastContainer, toast } from 'react-toastify';
import { fetchProjectInfo } from '../../api/project';
import { addNewRole, deleteRole, updateRole } from '../../api/role';
import Modal from 'react-modal';
import roleImage from "../../Assets/jwt.png";

const imageStyle = {
  width: '100px',
  height: '100px',
  borderRadius: '4px',
  marginBottom: '10px',
  objectFit: 'cover',
};

const cardStyle = {
  marginBottom: '20px',
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '8px',
  backgroundColor: '#f9f9f9',
  alignItems: 'center',
  gap: '10px',
  width: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center',
};

const roleNameStyle = {
  marginBottom: '10px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  width: '100%',
};

const buttonStyle = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  cursor: 'pointer',
  marginTop: '20px',
  marginLeft: '10px',
  width: '200px',
};

const inputStyle = {
  padding: '10px',
  marginTop: '20px',
  marginRight: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  width: '200px',
};

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [editRoleName, setEditRoleName] = useState('');
  const { projectId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRole = async () => {
    if (newRoleName !== '') {
      const response = await addNewRole(newRoleName, projectId, []);
      if (response.error) {
        toast.error("Something went wrong");
        return;
      }
      setNewRoleName('');
      window.location.reload();
    }
  };

  const handleDeleteRole = async (roleIndex) => {
    const res = await deleteRole(roles[roleIndex]._id, projectId);
    if (res.error) {
      toast.error("Something went wrong");
    } else {
      window.location.reload();
    }
  };

  const handleSelectRole = (roleIndex) => {
    setSelectedRole(roleIndex);
    setEditRoleName(roles[roleIndex].name);
    setIsModalOpen(true);
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
      const projectInfo = await fetchProjectInfo(projectId);
      if (projectInfo.error) {
        toast.error("Something went wrong");
        return;
      }
      setPermissions(projectInfo?.project?.permissions);
      setRoles(projectInfo?.roles);
    } catch (error) {
      console.error("Error fetching permissions and roles:", error);
    }
  };

  const handleSave = async (id, roleIndex) => {
    const update = await updateRole(id, editRoleName, roles[roleIndex].permissions);
    if (update.error) {
      toast.error("something went wrong");
      return;
    }
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    console.log("roles are", roles);
  }, [roles]);

  useEffect(() => {
    getPermissionsAndRoles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          id="roleName"
          name="roleName"
          value={newRoleName}
          placeholder="Role Name"
          onChange={(e) => setNewRoleName(e.target.value)}
          required
          style={inputStyle}
        />
        <button onClick={handleAddRole} style={buttonStyle}>Add New Role</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {roles.map((role, roleIndex) => (
          <div key={roleIndex} style={cardStyle}>
            <img src={roleImage} alt="Role" style={imageStyle} />
            <div>
              <h3 style={{ roleNameStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {role.name.length > 10 ? `${role.name.substring(0, 10)}...` : role.name}
              </h3>
              <button onClick={() => handleSelectRole(roleIndex)} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
              <button onClick={() => handleDeleteRole(roleIndex)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Edit Role"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              padding: '20px',
              borderRadius: '8px',
              maxWidth: '500px',
              width: '100%'
            }
          }}
        >
          <h2>Edit Role</h2>
          <input
            type="text"
            value={editRoleName}
            name="roleName"
            required
            style={{ padding: '5px', marginBottom: '20px', width: '100%' }}
            onChange={(e) => setEditRoleName(e.target.value)}
          />
          <ul>
            {permissions.map((permission, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                <input
                  type="checkbox"
                  checked={roles[selectedRole]?.permissions?.includes(permission)}
                  onChange={() => handlePermissionChange(selectedRole, permission)}
                  style={{ marginRight: '5px' }}
                />
                {permission}
              </li>
            ))}
          </ul>
          <button onClick={() => setIsModalOpen(false)} style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Cancel</button>
          <button onClick={() => handleSave(roles[selectedRole]._id, selectedRole)} type="submit" style={{ padding: '5px 10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
        </Modal>
      )}
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

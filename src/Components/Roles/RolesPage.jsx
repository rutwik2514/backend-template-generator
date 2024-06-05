import React, { useState } from 'react';
import permissions from './permissiona';

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [newRoleName, setNewRoleName] = useState('');

  const handleAddRole = () => {
    if (newRoleName !== '') {
      setRoles((prev) => [
        ...prev,
        {
          name: newRoleName,
          permissions: [],
        }
      ])
      setNewRoleName('');
    }
  }

  const handleEditRole = (roleIndex, updatedRoleName) => {
    setRoles((prev) => {
      const allRoles = prev.map((role, index) => {
        if (index === roleIndex) {
          return {
            ...role,
            name: updatedRoleName
          }
        } else {
          return role;
        }
      })
      return allRoles;
    })
    setSelectedRole(null);
  }

  const handleDeleteRole = (roleIndex) => {
    console.log(roleIndex);
    setRoles((prev) => {
      const updatedRoles = prev.filter((role, index) => index !== roleIndex);
      return updatedRoles;
    });
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


  console.log("roles", roles);

  return (
    <div>
      <h2>RolesPage</h2>
      <div>
        <input
          type="text"
          id="roleName"
          name="roleName"
          value={newRoleName}
          placeholder='Role Name'
          onChange={(e) => setNewRoleName(e.target.value)}
          required
        />
        <button onClick={handleAddRole}>Add Role</button>
      </div>
      {roles.map((role, roleIndex) => (
        <div key={roleIndex}>
          <h3>
            {selectedRole ? (
              // change to div
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditRole(roleIndex, e.target.roleName.value)
                }}
              >
                <input type="text" defaultValue={role.name} name="roleName" required />
                <button type="submit">Save</button>
              </form>
            ) : (
              role.name
            )}
          </h3>
          <ul>
            {permissions.map((permission) => (
              <li key={permission}>
                <input
                  type="checkbox"
                  checked={role.permissions.includes(permission)}
                  onChange={() => handlePermissionChange(roleIndex, permission)}
                />
                {permission}
              </li>
            ))}
          </ul>
          {selectedRole ? (
            <>
              <button onClick={() => setSelectedRole(null)}>Cancel</button>
            </>
          ) : (
            <>
              <button onClick={() => handleSelectRole(role)}>Edit</button>
              <button onClick={() => handleDeleteRole(roleIndex)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>

  )
}

export default RolesPage

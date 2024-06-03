import React from 'react';

function RolePermissionFrom() {
    /*************************  State Declarations  *************************/
    const [roles,setRoles] = React.useState([]);
    const [currentRole, setCurrentRole] = React.useState('');
    const [currentPermission, setCurrentPermission] = React.useState({});
    const [editPermission, setEditPermission] = React.useState(null);

    /******************** Functions ************************************/
    const addRole = () => {
        if(currentRole!=='') {
            setRoles(prev=>[
                ...prev,
                {
                    name: currentRole,
                    permissions: []
                }
            ]);
            setCurrentRole('');
        }
    }

    const deleteRole = (roleIndex) => {
        setRoles(prev=>{
            const allRoles = [...prev]
            const filteredRoles = allRoles.filter((key,idx)=>idx!==roleIndex);
            return filteredRoles;
        })
    }

    const addPermission = (roleIndex) => {
        const permission = currentPermission[roleIndex];
        if(permission) {
            setRoles(prev=>{
                const newPermissionRoles = [...prev];
                newPermissionRoles[roleIndex].permissions.push(permission);
                return newPermissionRoles;
            });

            // Clearing out current permission so that next time there is no previously stored value
            const updatedPermissions = {...currentPermission};
            updatedPermissions[roleIndex]='';
            setCurrentPermission(updatedPermissions);
        }
    }

    const deletePermission = (roleIndex, permIndex) => {
        setRoles(prev=>{
            const allRoles = [...prev];
            allRoles[roleIndex].permissions = allRoles[roleIndex].permissions.filter((key,idx)=>idx!==permIndex);
            return allRoles;
        })
    }

    const modifyPermission = (roleIndex, permIndex) => {
        setEditPermission({
            roleIndex,
            permIndex,
            value: roles[roleIndex].permissions[permIndex]
        })
    }

    const savePermission = () => {
        setRoles(prev=>{
            const allRoles = [...prev];
            allRoles[editPermission.roleIndex].permissions[editPermission.permIndex] = editPermission.value;
            return allRoles;
        });
        // clearing out 
        setEditPermission(null);
    }

    // const getAllPermissions = () => {

    // }

    return (
        <>
            <div>Roles and Permissions</div>
            <div>
                <input type="text"
                placeholder='Role Name'
                value={currentRole}
                onChange={(e)=>{setCurrentRole(e.target.value)}}
                />
                <button onClick={addRole}>Add Role</button>
            </div>

            {roles.map((role,roleIndex)=>(
                <div key={roleIndex}>
                    <h3>
                        {role.name};
                        <button onClick={(e)=>deleteRole(roleIndex)}>Delete Role</button>
                    </h3>

                    <div>
                        <input type="text"
                        placeholder='Permission'
                        value={currentPermission[roleIndex]}
                        onChange={(e)=>setCurrentPermission(prev=>({...prev, [roleIndex]: e.target.value}))} />
                        <button onClick={(e)=>addPermission(roleIndex)}>Add Permission</button>
                    </div>

                    <ul>
                        {role.permissions.map((permission,permIndex)=> (
                            <li key={permIndex}>
                            {editPermission && editPermission.roleIndex === roleIndex && editPermission.permIndex === permIndex ? (
                                <>
                                    <input type="text"
                                    value={editPermission.value}
                                    onChange={(e)=>setEditPermission(prev=>({...prev, value:e.target.value}))} />
                                    <button onClick={savePermission}>Save</button>
                                    <button onClick={()=>setEditPermission(null)}>None</button>
                                </>
                            ) : (
                                <>
                                    {permission}
                                    <button onClick={()=>modifyPermission(roleIndex,permIndex)}>Edit</button>
                                    <button onClick={()=>deletePermission(roleIndex,permIndex)}>Delete</button>
                                </>
                            )}

                            </li>
                        ))}
                    </ul>
                </div>
            ))}


        </>
    )
}

export default RolePermissionFrom;
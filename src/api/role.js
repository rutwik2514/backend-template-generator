import axiosInstance from "../Utils/Axios";

const addNewRole = async (name, projectId, permissions) => {
    try {
        console.log("project id is", projectId);
        const res = await axiosInstance.post("/role/new",{
            name: name,
            projectId: projectId,
            permissions: permissions
        });
        return { role: res?.data?.message, error: null};
    } catch (error) {
        console.log("Error adding new role:", error);
        return {role: null, error: error?.response?.data?.message};
    }
}

const deleteRole = async (role,projectId) => {
    try {
        const res = await axiosInstance.delete("/role/deleteRole", {
            data: {
                role: role,
                projectId:projectId
            }
        });
        return {error: null};
    } catch (error) {
        console.error("Error deleting role:", error);
        return {error: error?.response?.data?.message};
    }
}

const updateRole = async (role, name, permissions) => {
    try {
        const res = await axiosInstance.patch("/role/update", {
            role: role,
            name: name,
            permissions: permissions
        });
        return {res: res, error: null};
    } catch (error) {
        console.log("error updating role:", error);
        return {error: error?.res?.data?.message};
    }
}

export {addNewRole, deleteRole, updateRole};


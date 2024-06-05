import axiosInstance from "../Utils/Axios";

const addPermissions = async (projectId, permission) => {
    try {
        const res = await axiosInstance.post("/project/addPermission", {
            projectId: projectId,
            permissions: permission
        });
        return {data: res?.data, error: null}
    } catch (error) {
        return {data: null, error: error?.response?.data?.message};
    }
};

const deletePermission = async (projectId, permission) => {
    try {
        const res = await axiosInstance.delete("/project/deletePermission", {
            data: {
                projectId: projectId,
                permission: permission
            }
        });
        return {data: res?.data, error: null}
    } catch (error) {
        return {data: null, error: error?.response?.data?.message};
    }
};

export {addPermissions, deletePermission};
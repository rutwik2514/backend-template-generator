import axiosInstance from "../Utils/Axios";

const addNewSchema = async (schemaName, projectId, fields) => {
    try {
        const res = await axiosInstance.post(`/schema/new/${projectId}`,{
            name: schemaName,
            fields: fields
        })
        return {res: res?.data?.message, error:null};
    } catch (error) {
        console.log(error);
        return {projects: "", error: error?.message}
    }
}

const fetchSchemas = async () => {
    
}

export {addNewSchema};

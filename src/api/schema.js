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

const fetchSchema = async (schemaId) => {
    try {
        const res = await axiosInstance.get(`/schema/getSchema/${schemaId}`)
        console.log("response of sschema info is", res);
        return {res: res?.data?.schema, error:null};

    } catch (error) {
        console.log(error);
        return {res: "", error: error?.message}
        
    }
}

const updateSchema = async (schemaId,fields) =>{
    try {
        const res = await axiosInstance.patch(`/schema/update/${schemaId}`,{
            fields:fields
        });
        console.log("update response is", res);
    } catch (error) {
        console.log(error);
        
    }
}

export {addNewSchema,fetchSchema,updateSchema};

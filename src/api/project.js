import axiosInstance from "../Utils/Axios";

const fetchProjects = async() => {
    try {
      const projects = await axiosInstance.get("/project/getProjects");
      console.log("response from fetch project is", projects);
      return {projects: projects?.data?.projects, error:null};
    } catch (error) {
      console.log(error);
      return {projects: "", error: error?.response?.data?.message}
    }
  
  }
  const fetchProjectInfo = async(id) =>{
    try {
      const project = await axiosInstance.get(`/project/getProjectInfo/${id}`);
      return {project: project?.data?.project, error:null};
    } catch (error) {
      console.log(error);
      return {projects: "", error: error?.message}
    }
  }

  const addNewProject = async(name) =>{
    try {
      const res = await axiosInstance.post(`/project/new`,{name:name});
      console.log("res is", res);
      return {res: res?.data?.message, error:null};
    } catch (error) {
      console.log(error);
      return {projects: "", error: error?.message}
    }
  }

  export {fetchProjects, fetchProjectInfo, addNewProject };

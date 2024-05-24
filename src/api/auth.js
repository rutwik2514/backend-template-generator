import axiosInstance from "../Utils/Axios";

const handleLogin = async (data) => {
    try {
      const { email, password } = data;
      const response = await axiosInstance.post("/auth/login", {
        email: email,
        password: password,
      })
      return { token: response.data.data, error: null };
    } catch (error) {
      console.log("error is", error);
      return {error: error.response.data.message}
    }
  };

 const handleRegister = async(data) =>{
  try {
    const { email, password, userName,confirmPassword } = data;
    const response = await axiosInstance.post("/auth/register", {
      email: email,
      password: password,
      userName:userName,
      confirmPassword:confirmPassword
    })
    return {error: null };
  } catch (error) {
    console.log("error is", error);
    return {error: error.response.data.message}
  }
 }

  const fetchUser = async() => {
    try {
    console.log("axios instance is", axiosInstance);

      const user_info = await axiosInstance.get("/auth/fetchUser");
      console.log("response from fetch user is", user_info);
      return {user: user_info.data.message, error:null};
    } catch (error) {
      console.log(error);
      return {user: "", error: error.message}
    }
  
  }

  export { handleLogin, fetchUser, handleRegister };
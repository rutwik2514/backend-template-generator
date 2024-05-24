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
      const user_info = await axiosInstance.get("/auth/verify");
      return {user: user_info.data, error:null};
    } catch (error) {
      console.log(error);
      return {user: "", error: error.message}
    }
  
  }

  export { handleLogin, fetchUser, handleRegister };
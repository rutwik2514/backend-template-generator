import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Homepage from './Components/Homepage';
import Register from './Components/Register';
import Login from "./Components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Components/Dashboard';
import { AuthContext } from './context/Auth_Context';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchUser } from './api/auth';
import Navbar from './Components/Navbar/Navbar';
import RolePermissionForm from './Components/RolePermission/RolePermissionForm';
import Permission from './Components/Permission';
// import NewProject from './Components/NewProject';
import Project from './Components/Project';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

const AppRoutes = () => {
  const location = useLocation();
  const [userData, setUserData] = useState({ user: "" })

  //verifying token in local storage
  const verifyToken = async () => {
    if (localStorage.getItem("token")) {
      const res = await fetchUser();
      if (res?.error === null)
        setUserData({ user: res.user });
      else
        toast.error(res.error)
    } else {
      toast.error("You are unauthorized to access this resource");
      setTimeout(() => {
        window.location.replace("/login");
      }, 3000);
    }
  };

  //calling verify token function if user is not on login, register or home page
  useEffect(() => {
    if (location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/") {
      verifyToken();
    }
  }, [location.pathname]);

  return (
    <>
      <AuthContext.Provider value={{ userData, setUserData }} >
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/register" element={<Register />} />
          <Route index exact path="/login" element={<Login />} />
          <Route index exact path="/permission" element={<Permission   />} />
          <Route index exact path="/project/:projectId" element={<Project   />} />

          <Route exact path="/navbar" element={<Navbar/>}/>
          <Route exact path='/permissions' element={<RolePermissionForm />}/>
        </Routes>
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
        /></AuthContext.Provider></>
  );
};
export default App;

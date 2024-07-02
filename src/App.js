import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Homepage from './Components/Homepage';
import Register from './Components/Register';
import Login from "./Components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import 'react-toastify/dist/ReactToastify.css';
import LandingPage from './Components/Dashboard/Index';
import { AuthContext } from './context/Auth_Context';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { fetchUser } from './api/auth';
import PermissionsPage from './Components/Permissions/PermissionsPage';
import Navbar from './Components/Navbar/Navbar';
import RolesPage from './Components/Roles/RolesPage';
import ProjectDashboard from './Components/Project/Project_Dashboard';
import Schema from './Components/Schema/Schema';
import SchemaCreate from './Components/Schema/Schema_create';
import Layout from './Components/Layout/Layout';

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
      <AuthContext.Provider value={{ userData, setUserData}} >
        <Routes>
          <Route exact path="/" element={<Layout><Homepage /></Layout>} />
          <Route exact path="/dashboard" element={<Layout> <LandingPage /> </Layout>} />
          <Route exact path="/register" element={<Layout><Register /></Layout>} />
          <Route index exact path="/login" element={<Layout><Login /></Layout>} />
          <Route index exact path="/project/:projectId" element={<Layout><ProjectDashboard   /></Layout>} />
          <Route exact path="/navbar" element={<Layout><Navbar/></Layout>}/>
          <Route exact path='/project/:projectId/permissions' element={<Layout><PermissionsPage /></Layout>}/>
          <Route exact path='/project/:projectId/roles' element={<Layout><RolesPage /></Layout>}/>
          
          <Route exact path='/project/:projectId/schema' element={<Layout><Schema /></Layout>}/>
          <Route exact path='/project/:projectId/schema/create/:newSchemaName' element={<Layout><SchemaCreate /></Layout>}/>


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

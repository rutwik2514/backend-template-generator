import React, { useContext } from 'react';
import { AuthContext } from '../context/Auth_Context';
import Navbar from './Navbar/Navbar';
import { ToastContainer } from 'react-toastify';
import Project from './Project/Project';

const dashboardStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
};

const greetingStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

function Dashboard() {
  const { userData } = useContext(AuthContext);

  return (
    <div style={dashboardStyle}>
      <Navbar />
      <div style={greetingStyle}>Hello {userData.user.userName}</div>
      <Project />
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
      />
    </div>
  );
}

export default Dashboard;

import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from './Components/Homepage';
import Register from './Components/Register';
import Login from "./Components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import Dashboard from './Components/Dashboard';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/dashboard" element={<Dashboard />} />


          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

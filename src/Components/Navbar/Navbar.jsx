import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoListSharp } from "react-icons/io5";
import { TfiPencilAlt } from "react-icons/tfi";
import { MdOutlineDashboard } from "react-icons/md";

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const isWideScreen = windowWidth > 1000;

  const handleClickOutside = (event) => {
    //checks if click is not on sidebar
    if (sidebar && !isWideScreen && !document.querySelector('.sidebar-menu').contains(event.target) && !document.querySelector('.sidebar-icons').contains(event.target)) {
      setSidebar(false);
    }
  };

  useEffect(() => {
    if (!isWideScreen) {
      if (sidebar && !isWideScreen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else if (!isWideScreen) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
    // eslint-disable-next-line
  }, [sidebar]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {isWideScreen ? (
        <>
          <nav className="navbar-wideScreen">
            <div className="logo" onClick={()=>navigate(`/dashboard`)} style={{ marginLeft: "30px" }}> BackendBuddy</div>
            <ul className="nav-links" style={{ marginRight: "50px" }}>
              <li><Link >Permissions</Link></li>
              <li><Link >Roles</Link></li>
              <li><Link to="/project">Project</Link></li>
              <li><Link >Logout</Link></li>
            </ul>
          </nav>
        </>
      ) : (
        <>
          <div style={{ maxWidth: "100vw" }}>
            <div className='navbar'>
              <Link to='#' className='sidebar-icons'>
                <FaBars onClick={showSidebar} />
              </Link>
            </div>
            <nav className={sidebar ? 'sidebar-menu active' : 'sidebar-menu'}>
              <ul className='sidebar-menu-items' onClick={showSidebar}>
                <li className='sidebar-toggle'>
                  <Link to='#' className='sidebar-icons'>
                    <IoMdClose style={{ color: "black" }} />
                  </Link>
                </li>
                <li className="list-items">
                  <Link to='/permission'>
                    <MdOutlineDashboard style={{ color: "black" }} />
                    <span style={{ color: "black" }}>Permissions</span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to='/newproject'>
                    <MdOutlineDashboard style={{ color: "black" }} />
                    <span style={{ color: "black" }}>New Project</span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to='#'>
                    <IoListSharp style={{ color: "black" }} />
                    <span style={{ color: "black" }}>Projects</span>
                  </Link>
                </li>
                <li className="list-items">
                  <Link to='#'>
                    <CiLogout style={{ color: "black" }} />
                    <span style={{ color: "black" }}>Log Out</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

        </>
      )}
    </>
  );
}

export default Navbar;



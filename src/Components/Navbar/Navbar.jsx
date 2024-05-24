import './Navbar.css';
import React, { useState } from 'react';
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

  return (
    <>
      <div className='navbar'>
        <Link to='#' className='sidebar-icons'>
          <FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? 'sidebar-menu active' : 'sidebar-menu'}>
        <ul className='sidebar-menu-items' onClick={showSidebar}>
          <li className='sidebar-toggle'>
            <Link to='#' className='sidebar-icons'>
              <IoMdClose />
            </Link>
          </li>
          <li className="list-items">
            <Link to='#'>
              <MdOutlineDashboard />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className="list-items">
            <Link to='#'>
              <TfiPencilAlt />
              <span>New Project</span>
            </Link>
          </li>
          <li className="list-items">
            <Link to='#'>
              <IoListSharp />
              <span>Projects</span>
            </Link>
          </li>
          <li className="list-items">
            <Link to='#'>
              <CiLogout />
              <span>Log Out</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;



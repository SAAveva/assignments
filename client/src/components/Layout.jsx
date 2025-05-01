import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { US, IL } from 'country-flag-icons/react/3x2';

import { useAuth } from '../hooks/useAuth';
import { api } from './../api.js';

import { Footer } from './Footer.jsx';

export const Layout = () => {
  const { logout, user } = useAuth();

  useEffect(() => {
    (async () => {
      const test_req = await api.students.list();
      if (test_req.message && test_req.message == "no session with this id found")
        logout();
    })();
  }, []);

  return (
    <div className="layout">
      <div className="header">
        <div className="header-backdrop">
          <menu className="user-settings"> 
            <span><FaUser /> Hello, &#123;{user.fullname}&#125; / <a><US /></a> / <a onClick={logout}>Logout</a></span>
          </menu>
          <nav className="main-nav">
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/assignments">Assignments</NavLink>
          </nav>
        </div>
      </div>
      <Outlet />
      <Footer />
   </div>
  );
};

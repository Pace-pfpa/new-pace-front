import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Upload</Link></li>
        <li><Link to="/view">View</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

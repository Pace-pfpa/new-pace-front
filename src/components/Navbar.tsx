import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li><Link className='link-react' to="/">Upload</Link></li>
        <li><Link className='link-react' to="/view">View</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

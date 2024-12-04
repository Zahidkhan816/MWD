import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
    return (
        <div className="header">
            <div className="header__logo">
                <h4>
                <strong>Documents Reader (POC)</strong>
                </h4>
            </div>
            <nav className="navbar">
                <div className="navbar__menu">
                    <Link to="/" className="navbar__link">
                        Upload File
                    </Link>
                    <Link to="/table-list" className="navbar__link">
                        Documents
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;

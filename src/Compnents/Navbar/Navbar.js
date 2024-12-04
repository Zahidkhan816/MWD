import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.scss';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate('/')
    }

    return (
        <div className="header">
            <div className="header__logo">
                <h4 onClick={handleNavigate} className="header__logo" style={{cursor:"pointer"}}>
                        Documents Reader (POC)
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

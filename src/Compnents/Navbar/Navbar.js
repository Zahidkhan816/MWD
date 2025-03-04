import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import Logo from '../Assets/logo.jpg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location
    const [anchorElNav, setAnchorElNav] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const getLinkStyle = (path) => {
        return location.pathname === path
            ? { color: 'black', fontWeight: 'bold', textDecoration: 'underline', fontWeight: 600, fontSize: "18px" }
            : { color: 'White', textDecoration: 'none', fontWeight: 600, fontSize: "18px" };
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ mr: 3, cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src={Logo} alt="Logo" style={{ maxWidth: '150px', height: 'auto' }} />
                    </Box>

                    {/* Mobile Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link to="/" style={getLinkStyle('/')}>
                                    Upload File
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Link to="/table-list" style={getLinkStyle('/table-list')}>
                                    Documents
                                </Link>
                            </MenuItem>
                        </Menu>
                    </Box>

                    {/* Desktop Menu */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '25px' }}>
                        <Link to="/" style={getLinkStyle('/')}>
                            Upload File
                        </Link>
                        <Link to="/table-list" style={getLinkStyle('/table-list')}>
                            Documents
                        </Link>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;

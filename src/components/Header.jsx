import React, { } from 'react'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import Logo from '../assets/img/logo.png';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const pages = [
    { index: 0, nome: 'IMPORTAR DADOS', path: '/' },
    { index: 1, nome: 'IMPORTAÇÕES', path: '/importacoes' },
];


function Header({ user, handleLogout }) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [open, setOpen] = React.useState(false);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleClickOpen = () => {
        setOpen(true);
        setAnchorElNav(null);
    };

    const handleClose = () => {
        setOpen(false);
        setAnchorElNav(null);
    };

    console.log("User: ", user)

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, p: 1 }}>
                        <img width={100} src={Logo} alt="logotipo" />
                    </Box>

                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GERA.REM
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
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
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'flex', md: 'none' },
                                flexDirection: 'column'
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.index} onClick={handleCloseNavMenu}>
                                    <Link
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                        to={page.path}
                                    >
                                        {page.nome}
                                    </Link>
                                </MenuItem>

                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, p: 1 }}>
                        <img width={100} src={Logo} alt="logotipo" />
                    </Box>

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#app-bar-with-responsive-menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        GERA.REM
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: '20px' }}>
                        {pages.map((page) => (
                            <Link
                                key={page.index}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                                to={page.path}
                            >
                                <Button color="secondary">{page.nome}</Button>
                            </Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                            <Tooltip title={user.name}>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src={user.picture} />
                                </IconButton>
                            </Tooltip>
                            <Typography variant="caption">{user.email}</Typography>
                        </Box>

                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            <MenuItem onClick={handleClickOpen}>
                                <Typography textAlign="center">Dados da empresa</Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseUserMenu}>
                                <Typography onClick={handleLogout} textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                </DialogActions>
            </Dialog>
        </AppBar>
    );
}
export default Header;
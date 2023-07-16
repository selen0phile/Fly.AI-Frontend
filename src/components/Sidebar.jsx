import React, { useContext, useEffect, useState } from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';

import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Folder, Home, HomeRepairServiceOutlined, Leaderboard, LibraryBooks, Logout, Person } from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';
import { Switch } from '@mui/material';
import ThemeContext from '../contexts/ThemeContext';
import Container from '@mui/material/Container';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';
import '../App.css'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';


const drawerWidth = 260;

function Sidebar() {

    const [darkMode, setDarkMode] = useState(false)
    const { mode, setMode } = useContext(ThemeContext);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const history = useHistory()
    const { currentUser } = useAuth()
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const isMobile = useMediaQuery({ query: '(max-width: 800px)' })

    function handleSidebar(e, dir) {
        if (dir !== 'undefined') {
            console.log('Sidebar redirecting to /' + dir)
            history.push('/' + dir)
        }
        else {
            var type = e.target.innerText.toLowerCase().trim()
            console.log('Sidebar redirecting to /' + type)
            history.push('/' + type)
        }
    }
    useEffect(() => {
        if (mode === 'dark') setDarkMode(true)
        else setDarkMode(false)
    })
    function changeMode() {
        if (darkMode) {
            localStorage.setItem('theme', 'light')
            setMode('light')
            setDarkMode(false)
        }
        else {
            setDarkMode(true)
            setMode('dark')
            localStorage.setItem('theme', 'dark')
        }
    }
    const drawer = (
        <div>
            <Toolbar />

            <List style={{ fontSize: '15px', padding: 0 }}>
                {/* <ListItem disablePadding>
            <ListItemButton sx={{ width: '100%', height: '5em' }}>
                <Box sx={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center',fontSize: '12px',flexFlow:'column' }}>
                <b>DARK MODE</b>
                <Switch onChange={changeMode} checked={darkMode}/>
                </Box>
            </ListItemButton>
            </ListItem> */}
                <ListItem disablePadding>
                    <Box sx={{ width: '100%', height: '8em' }}>
                        <Box sx={{ margin: 'auto', marginTop: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px' }}>
                            <img src='/logo (2).png' height={'50px'}/>
                            <span className='litcode'>Fly.AI</span>
                        </Box>
                    </Box>
                </ListItem>
                {/* <ListItem disablePadding>
                    <ListItemButton sx={{ width: '100%', height: '5em' }} onClick={(e) => handleSidebar(e,'home')}>
                        <Box sx={{ marginLeft:'10px', display: 'flex', alignItems: 'center' }}>
                            <Home style={{ fontSize: '1.5em' }} />&nbsp;HOME
                        </Box>
                    </ListItemButton>
                </ListItem> */}
                <ListItem disablePadding>
                    <ListItemButton sx={{ width: '100%', height: '5em' }} onClick={(e) => handleSidebar(e, 'chat')}>
                        <Box sx={{ marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ChatBubbleIcon style={{ fontSize: '1.5em' }} />&nbsp;CHAT
                        </Box>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton sx={{ width: '100%', height: '5em' }} onClick={(e) => handleSidebar(e, 'profile')}>
                        <Box sx={{ marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AccountCircleIcon style={{ fontSize: '1.5em' }} />&nbsp;PROFILE
                        </Box>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton sx={{ width: '100%', height: '5em' }} onClick={(e) => handleSidebar(e, 'books')}>
                        <Box sx={{ marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AutoStoriesIcon style={{ fontSize: '1.5em' }} />&nbsp;BOOKS
                        </Box>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton sx={{ width: '100%', height: '5em' }} onClick={(e) => handleSidebar(e, 'logout')}>
                        <Box sx={{ marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Logout style={{ fontSize: '1.5em' }} />&nbsp;LOGOUT
                        </Box>
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
    return (
        <div>

            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    display: { md: 'none', lg: 'none', sm: 'none' }
                }}
            >
                <Toolbar color="inherit">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' }, transform: 'scale(1.5)', margin: '1px' }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">

                    </Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

        </div>
    )
}

export default Sidebar
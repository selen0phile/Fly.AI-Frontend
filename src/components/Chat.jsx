import React from 'react'
import { Redirect } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Box, Grid, Button, Link,TextField } from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GetAppIcon from '@mui/icons-material/GetApp';
import ChatBox from './ChatBox.jsx';

const drawerWidth = 260;
function Chat() {
	return (
		<Box sx={{ display: 'flex' }}>
			<Sidebar />
			<Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
				<ChatBox/>
			</Box>
		</Box >
	)
}

export default Chat
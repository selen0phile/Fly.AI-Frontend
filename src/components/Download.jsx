import React from 'react'
import { Redirect } from 'react-router-dom'
import Sidebar from './Sidebar'
import {Box, Grid, Button,Link} from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GetAppIcon from '@mui/icons-material/GetApp';

const drawerWidth = 260;
function Download() {
  function go() {
    window.open('https://drive.google.com/file/d/1pUupVyeFcqo6jz7bXJXgHI-kqtopsLbe/view?usp=sharing','_blank')
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <h1>DOWNLOAD</h1>
        {/*  */}
        <Button onClick={go} variant='contained' sx={{fontSize: '20px', padding: '10px', width:'200px'}} size='large'><GetAppIcon/>&nbsp;CLICK HERE</Button>
      </Box>
    </Box >
  )
}

export default Download
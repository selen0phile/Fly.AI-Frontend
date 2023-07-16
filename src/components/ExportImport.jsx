import React from 'react'
import { Redirect } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Box, Grid, Button, Link } from '@mui/material'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import GetAppIcon from '@mui/icons-material/GetApp';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

import ImportExportIcon from '@mui/icons-material/ImportExport';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const drawerWidth = 260;
function ExportImport() {
    const [f,setF]=React.useState('')
    const [includeCache, setIncludeCache] = React.useState(false)

    const Export = () => {
        const zip = new JSZip()
        var keys = Object.keys(localStorage)
        var values = []
        for (var i = 0; i < keys.length; i++) {
            const filename = keys[i]
            if(filename.endsWith(".txt") || filename.endsWith(".json") || filename.endsWith("_time")) {
                if(includeCache === false) continue
            }
            zip.file(keys[i], localStorage.getItem(keys[i]));
        }
        zip.generateAsync({ type: 'blob' }).then(function (content) {
            FileSaver.saveAs(content, new Date().toLocaleString().replaceAll(' ', '').replaceAll(':', '-').replaceAll('/', '-').replace(',', '-') + '-export.zip');
        });
    }
    const Import = () => {
        if(f === '') {
            alert('Select a file first')
            return
        }
        JSZip.loadAsync(f).then(function (zip) {
            Object.keys(zip.files).forEach(function (filename) {
                zip.files[filename].async('string').then(function (fileData) {
                    localStorage.setItem(filename, fileData)
                    console.log('Loaded -> ',filename,fileData)
                })
            })
        })
        alert('Done')
    }
    const handleFile = (e) => {
        setF(e.target.files[0])
    }
    const ClearCache = (e) => {
        var keys = Object.keys(localStorage)
        for (var i = 0; i < keys.length; i++) {
            const filename = keys[i]
            if(filename.endsWith(".txt") || filename.endsWith(".json") || filename.endsWith("_time")) {
                localStorage.removeItem(filename)
            }
        }
        alert('Cache cleared')
    }
    const ClearProgress = (e) => {
        var v = prompt("Are you sure? (yes/no)")
        if(v !== 'yes') return
        var keys = Object.keys(localStorage)
        for (var i = 0; i < keys.length; i++) {
            const filename = keys[i]
            if(filename.endsWith(".txt") || filename.endsWith(".json") || filename.endsWith("_time")) {
                continue
            }
            else localStorage.removeItem(filename)
        }
        alert('Progress cleared')
    }
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <Box>
                    <h1>EXPORT</h1>
                    <input type="checkbox" value={includeCache} onChange={(e) => setIncludeCache(e.target.checked)}/> INCLUDE CACHE <br/><br/>
                    <Button onClick={Export} color="info" variant='contained' sx={{ fontSize: '20px', padding: '10px', width: '200px' }} size='large'><GetAppIcon />&nbsp;EXPORT</Button>
                </Box>
                <br />
                <br />
                <br />
                <Box>
                    <h1>IMPORT</h1>
                    <input type='file' onChange={handleFile} />
                    <br/>
                    <br/>
                    <Button onClick={Import} color="info" variant='contained' sx={{ fontSize: '20px', padding: '10px', width: '200px' }} size='large'><UploadIcon />&nbsp;IMPORT</Button>
                </Box>
                <Box>
                    <br/>
                    <Button onClick={ClearCache} variant='contained' sx={{ fontSize: '20px', padding: '10px', width: '200px' }} size='large'><DeleteIcon />&nbsp;CLEAR CACHE</Button>
                    <br/>
                    <br/>
                    
                    <Button onClick={ClearProgress} variant='contained' sx={{ fontSize: '20px', padding: '10px', width: '200px' }} size='large'><DeleteIcon />&nbsp;CLEAR PROGRESS</Button>
                </Box>
            </Box>
        </Box >
    )
}

export default ExportImport
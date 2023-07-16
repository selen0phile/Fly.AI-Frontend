import { Button, Card, Divider, Grid, Link } from '@mui/material'
import { Box, Container } from '@mui/material'
import { listAll, ref, getMetadata, getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { storage, auth } from '../firebase'
import Sidebar from './Sidebar'

import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TaskIcon from '@mui/icons-material/Task';

import { getDataFromFile } from '../Utils'
import '../App.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { useAuth } from '../contexts/AuthContext'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { saveAs } from 'file-saver'

function BookCard({ book }) {
    const history = useHistory()
    const { currentUser, token } = useAuth()

    function openBook(x) {
        window.location = `/books/${x.trim()}`
    }

    function openKeyword(x) {
        window.location = `/books/?keyword=${x.trim()}`
    }

    function openAuthor(x) {
        history.push(`/profile/${x.trim()}`);
    }

    function openBook(x) {
        window.open(x, '_blank')
    }

    function editClick() {
        history.push(`/edit/${book.bookId}`);
    }

    function downloadFile() {
        openBook(book.link)
    }
    function getTime() {
        if (time <= 0) return '00:00:00';
        try {
            var hours = Math.floor(time / 3600);
            var minutes = Math.floor((time % 3600) / 60);
            var remainingSeconds = time % 60;

            var formattedTime = hours.toString().padStart(2, '0') + ':' +
                minutes.toString().padStart(2, '0') + ':' +
                remainingSeconds.toString().padStart(2, '0');

            return formattedTime;
        }
        catch (er) { }
        return 'loading ...';
    }
    return (
        <Card sx={{ minWidth: '275px' }}>
            <Box>
                <Box sx={{ height: '50px', margin: '20px', marginBottom: '0px' }}>
                    Uploaded by:<Button size="small" onClick={() => openAuthor(book.author)}>{book.author}</Button>
                </Box>

                <CardActionArea sx={{ padding: '20px' }} onClickCapture={() => openBook(book.link)}>
                    <Box sx={{ height: '150px' }}>
                        <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                            Added: {new Date(book.createdAt).toLocaleString()} <br />
                        </Typography>
                        <Typography variant="h5" component="div">
                            {book.title}
                        </Typography>
                        <br />
                    </Box>
                    <Box sx={{ height: '200px', overflowY: 'hide' }}>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            <b>Description:</b> {book.description} <br />
                        </Typography>
                    </Box>
                    <Box sx={{ height: '20px' }}>

                    </Box>
                </CardActionArea>
                <Box sx={{ height: '70px', margin: '20px', overflow: 'hidden' }}>
                    <Typography variant="body2">
                        {
                            book.keywords.split(',').map((tag, id) =>
                                <span key={id}><Button sx={{ margin: '5px' }} size="small" variant="outlined" onClick={() => openKeyword(tag)}>{tag}</Button>&nbsp;</span>
                            )
                        }
                    </Typography>
                </Box>
                <Box sx={{ height: '50px', display: 'flex', alignItems: 'center', margin: '20px', justifyContent: 'space-between' }}>
                    {/* <Link href={book.link} target='_blank'><Button size="small"><TaskIcon/>&nbsp;SUBMISSION URL</Button></Link> */}
                    {/* &nbsp;&nbsp; */}
                    <Box>
                        <Button onClick={downloadFile}><CloudDownloadIcon sx={{ fontSize: '30px' }} /></Button>
                    </Box>
                    {
                        book.author === currentUser.username &&
                        <Box>
                            <Button><EditIcon onClick={editClick} sx={{ fontSize: '30px' }} /></Button>
                        </Box>

                    }
                </Box>
            </Box>
        </Card >
    )
}

export default BookCard
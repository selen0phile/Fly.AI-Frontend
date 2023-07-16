import { Button, Card, Divider, Grid, Link } from '@mui/material'
import { Box, Container, TextField } from '@mui/material'
import { listAll, ref, getMetadata, getDownloadURL } from 'firebase/storage'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { storage, auth } from '../firebase'
import Sidebar from './Sidebar'

import BookCard from './BookCard'

import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { getDataFromFile } from '../Utils'
import { useAuth } from '../contexts/AuthContext'

import apiURL from "../Config"

const drawerWidth = 260;
const colors = ['red', 'yellow', 'aqua', '#00ff00']

function Books() {
    const [books, setBooks] = useState([])
    const { id } = useParams()
    const [page, setPage] = useState(1)
    const { currentUser, token } = useAuth()

    const [search, setSearch] = useState({
        title: '',
        author: '',
        keyword: ''
    })

    const loadMore = async () => {
        await getData(page + 1)
        setPage(page + 1)
    }
    async function getData(page) {
        const url = apiURL + "/api/v1/book?page=" + page + "&title=" + search.title + "&author=" + search.author + "&keyword=" + search.keyword
        console.log(url)
        const options = {
            headers: {
                'Authorization': token
            }
        };
        const resp = await fetch(url, options)
        const json = await resp.json()
        console.log(json)
        setBooks([...books, ...json])
    }
    async function getInitialData(query) {
        const url = apiURL + "/api/v1/book?page=" + '1' + "&title=" + query.title + "&author=" + query.author + "&keyword=" + query.keyword
        console.log(url)
        const options = {
            headers: {
                'Authorization': token
            }
        };
        const resp = await fetch(url, options)
        const json = await resp.json()
        console.log(json)
        setBooks(json)
    }
    function parseQuery() {
        var obj = { 'title': '', 'author': '', 'keyword': '' }
        try {
            const queries = window.location.toString().split('?')[1].split('&')
            for (var i = 0; i < queries.length; i++) {
                const key = queries[i].split('=')[0]
                const val = queries[i].split('=')[1]
                obj[key] = val
            }
            console.log('Query ->', obj)
            setSearch(obj)
        }
        catch (err) {

        }
        return obj
    }
    useEffect(() => {
        getInitialData(parseQuery())
    }, [])
    const searchClick = async () => {
        await getInitialData(search)
    }
    const handleChange = (e) => {
        var t = { ...search }
        t[e.target.name] = e.target.value
        setSearch(t)
        console.log(t)
    }
    // function getColor(id) {
    //   if (localStorage.getItem(id + '_status') !== null) {
    //     const status = localStorage.getItem(id + '_status')
    //     if (status === 'ac') return '#00ff00'
    //     else return 'red'
    //   }
    //   return 'white'
    // }
    // async function handleSearch(e) {
    //   const searchValue = e.target.value
    //   setSearch(searchValue)
    //   var filteredList = []
    //   for(var i=0;i<problems.length;i++) {
    //     if(problems[i].title.toLower().includes(searchValue)) filteredList.push(i)
    //     else {
    //       try {  
    //         const metaData = JSON.parse(await getDataFromFile(problems[i].title, 'meta.json'))
    //         for(var j=0;j<metaData['tags'].length;j++) {
    //           if(metaData['tags'][j].toLower().includes(searchValue)) {
    //             filteredList.push(i)
    //             break
    //           }
    //         }
    //       }
    //       catch(err) {

    //       }
    //     }
    //   }
    //   setFiltered(filteredList)
    //   }
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
                <h1>BOOKS</h1>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={12} md={6} sm={12} lg={4} xl={3}>
                        <TextField name='title' id="outlined-basic" label="Title" variant="outlined" placeholder="Search by title" sx={{ width: '100%' }} value={search.title} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12} lg={4} xl={3}>
                        <TextField name='author' id="outlined-basic" label="Author" variant="outlined" placeholder="Search by author" sx={{ width: '100%' }} value={search.author} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12} lg={4} xl={3}>
                        <TextField name='keyword' id="outlined-basic" label="Keyword" variant="outlined" placeholder="Search by keyword" sx={{ width: '100%' }} value={search.keyword} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} md={6} sm={12} lg={4} xl={3}>
                        <Button size="large" onClick={searchClick}>Search</Button>
                    </Grid>
                </Grid>
                <br />
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        {books.map((book) =>
                            <Grid key={book.bookId} item xs={12} md={6} sm={12} lg={4} xl={3}>
                                <BookCard book={book} />
                            </Grid>
                        )}
                    </Grid>
                </Box>
                <center>
                    <Button size="large" variant='outlined' sx={{ margin: '70px', width: '50%' }} onClick={loadMore}>LOAD MORE</Button>
                </center>
            </Box>
        </Box >
    )
}

export default Books
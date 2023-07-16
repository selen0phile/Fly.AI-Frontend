import { Button, Card, Divider, Grid, Link } from '@mui/material'
import { Box, Container, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Sidebar from './Sidebar'

import BookCard from './BookCard'

import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { useAuth } from '../contexts/AuthContext'
import apiURL from "../Config"
import Dictaphone from './Dictaphone'


const drawerWidth = 260;
const colors = ['red', 'yellow', 'aqua', '#00ff00']

function Profile() {
  const history = useHistory()

  const [books, setBooks] = useState([])
  const [page, setPage] = useState(1)
  const [user, setUser] = useState({
    username: 'asdsad',
    bio: 'asdasdasd',
    profilePicture: '',
    name: ''
  })

  const { currentUser, token } = useAuth()
  const { id } = useParams()
  const loadMore = async () => {
    await getData(page + 1)
    setPage(page + 1)
  }
  async function getData(page) {
    const url = apiURL + "/api/v1/book?page=" + page + "&author=" + user.username
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
  async function getInitialData(user) {
    const url = apiURL + "/api/v1/book?page=1&author=" + user.username
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

  function openEdit(x) {
    history.push('/edit')
  }

  async function initialize() {
    if (id !== undefined && id !== '') {
      const url = apiURL + "/api/v1/user/" + id
      const options = {
        headers: {
          'Authorization': token
        }
      };
      const resp = await fetch(url, options)
      const json = await resp.json()
      setUser(json)
      getInitialData(json)
    }
    else {
      const url = apiURL + "/api/v1/user/" + currentUser.username
      const options = {
        headers: {
          'Authorization': token
        }
      };
      const resp = await fetch(url, options)
      const json = await resp.json()
      setUser(json)
      getInitialData(json)
    }
  }
  useEffect(() => {
    initialize()
  }, [id])
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

  const updateProfile = async () => {
    const url = apiURL + "/api/v1/user"
    const postData = JSON.stringify({
      username: user.username,
      name: user.name,
      bio: user.bio,
      profilePicture: user.profilePicture
    })
    const options = {
      method: "PUT",
      body: postData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      }
    };
    const resp = await fetch(url, options)
    const json = await resp.json()
    console.log('Updated user ->', json)
    alert('Updated')
  }
  const handleChange = (e) => {
    var u = { ...user }
    u[e.target.name] = e.target.value
    setUser(u)
    console.log(u)
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box>
            <TextField
              name='name'
              disabled={currentUser.username === user.username ? false : true}
              sx={{ input: { textAlign: "center" } }}
              onChange={handleChange}
              value={user.name}
              variant="standard"
              InputProps={{ disableUnderline: true, style: { fontSize: '40px', textAlign: 'center' } }}
            />
          </Box>
          <br />
          <Box sx={{ width: '90%' }}>
            <center>
              <TextField
                name='bio'
                variant='standard'
                onChange={handleChange}
                id="outlined-multiline-flexible"
                label="Bio"
                multiline
                disabled={currentUser.username === user.username ? false : true}
                sx={{ width: '70%' }}
                rows={5}
                InputProps={{ style: { fontSize: '20px', textAlign: 'center' } }}
                value={user.bio}
              />
            </center>
          </Box>
          <br />
          {currentUser.username === user.username &&

            <Button size="large" variant="outlined" sx={{ margin: '40px' }} onClick={updateProfile}>Save</Button>

          }
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <h1>UPLOADED BOOKS</h1>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {currentUser.username === user.username && <>
            <Button variant='outlined' onClick={openEdit}>Upload a book</Button>
          </>
          }
        </Box>
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

export default Profile
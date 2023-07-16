import React, { useEffect, useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from '../firebase'
import { query, doc, getDoc, addDoc, collection, setDoc } from 'firebase/firestore'
import { useParams } from 'react-router'
import { Button, LinearProgress } from '@mui/material';
import { Box } from '@mui/system';
import TextField from '@mui/material/TextField';
import { useAuth } from '../contexts/AuthContext';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Sidebar from './Sidebar';
import BookView from './BookView';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import apiURL from "../Config"

const drawerWidth = 260

function EditBook() {
  const [data, setData] = useState({
    'id': '',
    'bookId': '',
    'title': '',
    'link': '',
    'keywords': '',
    'description': '',
    'public': true
  })

  const [file, setFile] = useState()
  const [percent, setPercent] = useState(0)
  const [fileNo, setFileNo] = useState(1)
  const [uploading, setUploading] = useState(false)

  const { id } = useParams()
  const history = useHistory()
  const { currentUser,token } = useAuth()

  async function getData(id) {
    const url = apiURL + "/api/v1/book/" + id
    const options = {
      headers: {
        'Authorization':token
      }
    };
    const resp = await fetch(url, options)
    const json = await resp.json()
    setData(json)
    console.log('Fetched book ->', json)
  }
  useEffect(() => {
    if (id === undefined) return;
    getData(id)
  }, [id])
  async function deleteClick() {
    if (data.id === '' || !data.id) {
      // no book to delete :)
    }
    else {
      // delele this T_T
      const url = apiURL + "/api/v1/book/" + data.bookId
      const options = {
        method: "DELETE",
        headers: {
          'Authorization':token
        }
      };
      const resp = await fetch(url, options)
      const json = await resp.json()
      console.log('Deleted book ->', json)
      alert('Deleted')
    }
    history.push('/profile')
  }
  async function save() {
    if (data.id === '' || !data.id) {
      // create
      const url = apiURL + "/api/v1/book"
      console.log('Post data ->', data)
      const postData = JSON.stringify(data)
      const options = {
        method: "POST",
        body: postData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':token
        }
      };
      const resp = await fetch(url, options)
      const json = await resp.json()
      console.log('Created book ->', json)
      alert('Saved')
      setData(json)
    }
    else {
      //update
      const url = apiURL + "/api/v1/book"
      console.log('Post data ->', data)
      const postData = JSON.stringify(data)
      const options = {
        method: "PUT",
        body: postData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':token
        }
      };
      const resp = await fetch(url, options)
      const json = await resp.json()
      console.log('Updated book ->', json)
      alert('Saved')
      setData(json)
    }
  }

  function handleFileChange(e) {
    setFile(e.target.files[0])
  }
  function handleChange(e) {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }
  // function process(x) {
  //   return x.toLowerCase().replaceAll(' ', '-')
  // }
  // function getCode() {
  //   return data.title;
  // }
  function handleUpload() {
    if (!file) {
      alert('No file selected!')
    }
    setUploading(true);
    const storageRef = ref(storage, '/uploads/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on(
      "state_changed",
      (snap) => {
        const percent = Math.round((snap.bytesTransferred / snap.totalBytes) * 100)
        setPercent(percent)
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
          console.log('File uploaded to ->', url)
          setData({
            ...data,
            'link': url
          })
        })
      }
    )
  }

  // return (
  // <div style={{ fontSize: '14px' }}>
  //   <center>
  //     <h1>ADD PROBLEM</h1>

  //     <TextField placeholder="title" onChange={handleChange} name="title" value={data.title} />

  //     {uploading &&
  //       <div style={{marginTop: '30px'}}>
  //         Uploading file {fileNo} <br /><br />
  //         <LinearProgress sx={{ width: '50vw' }} variant="determinate" value={percent} />
  //       </div>
  //     }
  //     <br />
  //     <br />
  //     <input type="file" onChange={handleFileChange} multiple='multiple' /><br />
  //     <br/>
  //     <Button size="large" variant='contained' onClick={handleUpload}>UPLOAD</Button>
  //   </center>
  // </div>
  // )
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ display: 'flex', marginTop: '50px', flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Box sx={{ width: '60%' }}>
          <h1>UPLOAD A BOOK</h1>
          <TextField
            value={data.title}
            name='title'
            onChange={handleChange}
            placeholder="Title"
            sx={{ width: '100%' }}
          />
          <br />
          <br />
          <TextField
            value={data.description}

            name='description'
            onChange={handleChange}
            placeholder="Description"
            sx={{ width: '100%' }}
            multiline
            rows={5}
          />
          <br />
          <br />
          <TextField
            value={data.keywords}

            name='keywords'
            onChange={handleChange}
            placeholder="Keywords"
            sx={{ width: '100%' }}
          />
          <br />
          {uploading &&
            <div style={{ marginTop: '30px' }}>
              Uploading file
              <LinearProgress sx={{ width: '100%' }} variant="determinate" value={percent} />
            </div>
          }
          <br />
          <input type="file" onChange={handleFileChange} multiple='multiple' />&nbsp;&nbsp;
          <Button size="large" color="success" variant='contained' onClick={handleUpload}>UPLOAD</Button>
          <br />
          <br />
          <Button size="large" color="info" variant='contained' onClick={save}>SAVE</Button>
          <br/>
          <br/>
          <br/>
          <Button size="large" variant='contained' onClick={deleteClick}>DELETE</Button>
        </Box>
        <Box sx={{ height: '90px', margin: '20px' }}>
          <BookView url={data.link} />
        </Box>
      </Box>
    </Box >
  )
}

export default EditBook
import { TextFields } from '@mui/icons-material'
import { Box, Button, Link, TextField } from '@mui/material'
import { useRef, useState } from 'react'
import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHistory } from 'react-router-dom'
import '../App.css'
import { Redirect } from "react-router-dom"


function Register() {
    const formRef = useRef()
    const { register, currentUser } = useAuth()
    const [data, setData] = useState({
        email: '',
        password: '',
        name: '',
        bio: '',
    })

    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        if (loading) return;
        if (!formRef.current.reportValidity()) return
        try {
            setLoading(true)
            const resp = await register(data.email, data.password, data.name)
            alert('Account created successfully')
            history.push("/login")
        } catch {

        }
        setLoading(false)
    }
    function handleChange(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }
    return (
        <div className='content' style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {!currentUser ? <p /> : <Redirect to="/chat" />}
            <div style={{ backgroundImage: "url('wall.png')", height: '70vh', width: '30vw', backgroundSize: 'contained' }}>

            </div>
            <div style={{ height: '7  0vh', width: '30vw', padding: '50px' }}>
                <Box sx={{ width: '100%', height: '8em', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img src='/logo (2).png' height={'50px'} />
                    <span className='litcode'>Fly.AI</span>
                </Box>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <form ref={formRef}>
                        <TextField required name='name' onChange={handleChange} value={data.name} inputProps={{ style: { fontSize: '25px' } }} InputLabelProps={{ style: { fontSize: '15px' } }} variant='standard' type='text' label='Name' /><br /><br />
                        <TextField required name='email' onChange={handleChange} value={data.email} inputProps={{ style: { fontSize: '25px' } }} InputLabelProps={{ style: { fontSize: '15px' } }} variant='standard' type='text' label='Username' /><br /><br />
                        <TextField required name='password' onChange={handleChange} value={data.password} inputProps={{ style: { fontSize: '25px' } }} InputLabelProps={{ style: { fontSize: '15px' } }} variant='standard' type='password' label='Password' />
                        <br /><br />
                        <Button size="large" disabled={loading} onClick={handleSubmit} variant='outlined' sx={{ fontSize: '20px', padding: '10px' }}>Register</Button>
                        <br /><br />
                        <Link href='login'>Login</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
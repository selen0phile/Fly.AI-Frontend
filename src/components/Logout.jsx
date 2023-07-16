import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from "react-router-dom"

function Logout() {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    
    React.useEffect(() => {
        async function bye() {
            if(currentUser) {
                await logout()
            }
            history.push('/')
        }
        bye()
    })
    return (
        <div>Bye :)</div>
    )
}

export default Logout
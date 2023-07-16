import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import apiURL from "../Config"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [correctMcq, setCorrectMcq] = useState(0)

  function addCorrectMcq(x) {
    setCorrectMcq(correctMcq + x)
  }
  function signup(email, password) {
    // return auth.createUserWithEmailAndPassword(email, password)
  }

  async function login(username, password) {
    const url = apiURL + "/api/v1/login"
    const postData = JSON.stringify({
      username: username,
      password: password
    })
    const options = {
      method: "POST",
      body: postData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const resp = await fetch(url, options)
    const json = await resp.json()
    console.log('Token -> ', json.token)
    console.log('User -> ', json.user)
    setToken(json.token)
    setCurrentUser(json.user)
    localStorage.setItem('token', json.token)
    localStorage.setItem('user', JSON.stringify(json.user))
  }

  function logout() {
    setToken('')
    setCurrentUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('messages')
  }
  async function register(username, password, name) {
    const url = apiURL + "/api/v1/reg"
    const postData = JSON.stringify({
      username: username,
      password: password,
      name: name
    })
    const options = {
      method: "POST",
      body: postData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const resp = await fetch(url, options)
    const json = await resp.json()
    console.log('Registered ->', json)
    return json
  }
  function resetPassword(email) {
    // return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    // return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    // return currentUser.updatePassword(password)
  }

  useEffect(() => {
    try {
      if (localStorage.getItem('user') !== null && localStorage.getItem('token') !== null) {
        const data = localStorage.getItem('user')
        const json = JSON.parse(data)
        setCurrentUser(json)
        const token = localStorage.getItem('token')
        setToken(token)
      }
    }
    catch (err) {

    }
    setLoading(false)
  }, [])

  const value = {
    register,
    currentUser,
    token,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    addCorrectMcq
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

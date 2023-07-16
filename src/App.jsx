import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { createTheme, ThemeProvider, Box, CssBaseline } from '@mui/material'
import Profile from "./components/Profile"

import PrivateRoute from './PrivateRoute'
import './App.css'
import { MathJaxContext } from "better-react-mathjax"
import { AuthProvider } from "./contexts/AuthContext"
import Login from "./components/Login"
import Logout from "./components/Logout"
import Home from "./components/Home"
import Books from "./components/Books"
import EditBook from "./components/EditBook"
import BookView from "./components/BookView"
import Chat from "./components/Chat"
import Register from "./components/Register"

const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [["$", "$"]],
    displayMath: [["\\(", "\\)"]]
  },
  "HTML-CSS": {
    linebreaks: { automatic: true, width: "container" }          
  } 
}
function App() {
  const [mode, setMode] = useState('dark')
  const darkTheme = createTheme({
    palette: {
      mode: mode,
      primary: {
        // light: will be calculated from palette.primary.main,
        main: '#ff0000',
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
    typography: {
      fontFamily: 'Inconsolata'
    }
  })

  return (
    <MathJaxContext config={config}>
      <ThemeProvider theme={darkTheme}>
        <AuthProvider>
          <CssBaseline />
          <Box bgcolor={'background.default'} color={'text.primary'}>
            <Router>
              <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/logout" component={Logout} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/profile/:id" component={Profile} />
                <PrivateRoute exact path="/books" component={Books} />
                <PrivateRoute exact path="/books/:id" component={BookView} />
                <PrivateRoute exact path="/edit" component={EditBook} />
                <PrivateRoute exact path="/edit/:id" component={EditBook} />
                <PrivateRoute exact path="/chat" component={Chat} />
                <PrivateRoute exact path="/" component={Chat} />
              </Switch>
            </Router>
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </MathJaxContext>
  )
}

export default App

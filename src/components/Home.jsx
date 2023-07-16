import React from 'react'
import {Redirect} from 'react-router-dom'

function Home() {
  return (
    <div>
        <Redirect to='/problemset'/>
    </div>
  )
}

export default Home
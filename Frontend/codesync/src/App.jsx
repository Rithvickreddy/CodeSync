import React from 'react'
import LandingPage from './Components/LandingPage'
import Editor from './Components/Editor';
import Demo from './Components/Demo'
import {BrowserRouter,Routes,Route} from "react-router-dom";

const App = () => {
  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/editor/:roomId" element={<Editor />}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

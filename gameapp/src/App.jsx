import { useState } from 'react'
import './App.css'
import { Button } from 'react-bootstrap'
import Header from './Header'
import Footer from './Footer'
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import AddGame from './AddGame'
import UpdateGame from './UpdateGame'
import Protected from './Protected'
import Home from './Home'
import GameList from './GameList'
import GamesPage from './GamesPage'
import EmuList from './EmuList'
import AddEmu from './AddEmu'
import UpdateEmu from './UpdateEmu'
import EmuPage from './EmuPage'
import PlatformList from './PlatformList'
import AddPlatform from './AddPlatform'
import UpdatePlatform from './UpdatePlatform'
import CategoryList from './CategoryList'
import UpdateCategory from './UpdateCategory'
import AddCategory from './AddCategory'
import AddEvent from './AddEvent'
import EventsList from './EventsList'
import EventsPage from './EventsPage'
import UpdateEvent from './UpdateEvent'





function App() {

  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element ={<Home/>} />
            <Route path="/games" element = {<GamesPage/>} />
            <Route path="/emus" element = {<EmuPage/>} />
            <Route path="/events" element = {<EventsPage/>} />
            <Route path="register" element={<Register />} />
            <Route path="/addgame" element={<Protected Cmp={AddGame} />} />
          <Route path="/update/:id" element={<Protected  Cmp={UpdateGame} />} />
          <Route path="/" element={<Protected Cmp={GameList} />} />
          <Route path="/addemu" element={<Protected Cmp={AddEmu} />} />
          <Route path="/updateemu/:id" element={<Protected  Cmp={UpdateEmu} />} />
          <Route path="/listemu" element={<Protected Cmp={EmuList} />} />
          <Route path="/addplat" element={<Protected Cmp={AddPlatform} />} />
          <Route path="/updateplat/:id" element={<Protected  Cmp={UpdatePlatform} />} />
          <Route path="/listplat" element={<Protected Cmp={PlatformList} />} />
          <Route path="/addcat" element={<Protected Cmp={AddCategory} />} />
          <Route path="/updatecat/:id" element={<Protected  Cmp={UpdateCategory} />} />
          <Route path="/listcat" element={<Protected Cmp={CategoryList} />} />
          <Route path="/addevent" element={<Protected Cmp={AddEvent} />} />
          <Route path="/updateevent/:id" element={<Protected  Cmp={UpdateEvent} />} />
          <Route path="/listevent" element={<Protected Cmp={EventsList} />} />
          </Routes>
          <Footer></Footer>
          
        </BrowserRouter>
        
      </div>

    </>
  )
}

export default App

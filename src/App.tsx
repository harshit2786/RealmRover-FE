
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Github from './pages/Github'
import Map from './pages/Map'
import Game from './pages/Game/Game'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Login/>} path='/' />
      <Route element={<Github/>} path='/callback/github' />
      <Route element={<Map/>} path='/map-builder' />
      <Route element={<Game/>} path='/game' />
    </Routes>
    </BrowserRouter>
  )
}

export default App

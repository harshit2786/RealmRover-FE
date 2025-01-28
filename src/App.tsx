
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Github from './pages/Github'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Login/>} path='/' />
      <Route element={<Github/>} path='/callback/github' />
    </Routes>
    </BrowserRouter>
  )
}

export default App

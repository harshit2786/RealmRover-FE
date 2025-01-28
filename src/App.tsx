
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route element={<Login/>} path='/' />
    </Routes>
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Home from './pages/home/Home'

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  return (
    <>
      {currentPage == "home" && <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />}
    </>
  )
}

export default App

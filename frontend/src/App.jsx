import { useState } from 'react'
import './App.css'
import Home from './pages/home/Home'
import HowItWorks from './pages/how-it-works/HowItWorks'
import MyShelf from './pages/my-shelf/MyShelf'
import People from './pages/people/People'

function App() {
  const [currentPage, setCurrentPage] = useState("home")

  return (
    <>
      {currentPage === "home" && (
        <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "my-shelf" && (
        <MyShelf currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "people" && (
        <People currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "how-it-works" && (
        <HowItWorks currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
    </>
  )
}

export default App

import { useState, useEffect } from 'react'
import AddPerson from './pages/add-person/AddPerson'
import CreateDiary from './pages/create-diary/CreateDiary'
import EditDiary from './pages/edit-diary/EditDiary'
import EditPerson from './pages/edit-person/EditPerson'
import Home from './pages/home/Home'
import HowItWorks from './pages/how-it-works/HowItWorks'
import MyShelf from './pages/my-shelf/MyShelf'
import People from './pages/people/People'
import DiaryTextEditor from './pages/diary-text-editor/DiaryTextEditor'
import { getAppData, saveAppData } from './database'

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [appData, setAppData] = useState(null)

  useEffect(() => {
    getAppData()
    .then(data => setAppData(data))
    .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    if(appData){
      saveAppData(appData).then(message => console.log(message)).then(message => console.log(message))
    }
  }, [appData])

  const [editingDiaryId, setEditingDiaryId] = useState(null)
  const [openedDiaryId, setOpenedDiaryId] = useState(null)
  const [editingPersonId, setEditingPersonId] = useState(null)

  if(appData == null)
    return <></>

  const diaryList = appData.diaries
  const peopleList = appData.people

  return (
    <>
      {currentPage === "home" && (
        <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "create-diary" && (
        <CreateDiary 
          appData={appData}
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          setAppData={setAppData}
        />
      )}
      {currentPage === "edit-diary" && (
        <EditDiary
          appData={appData}
          diaryId={editingDiaryId}
          diaries={diaryList}
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "add-person" && (
        <AddPerson
          appData={appData}
          currentPage="people"
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "edit-person" && (
        <EditPerson
          appData={appData}
          people={peopleList}
          personId={editingPersonId}
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "my-shelf" && (
        <MyShelf
          appData={appData}
          currentPage={currentPage}
          diaries={diaryList}
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
          setEditingDiaryId={setEditingDiaryId}
          setOpenedDiaryId={setOpenedDiaryId}
        />
      )}
      {currentPage === "people" && (
        <People
          appData={appData}
          currentPage={currentPage}
          people={peopleList}
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
          setEditingPersonId={setEditingPersonId}
        />
      )}
      {currentPage === "how-it-works" && (
        <HowItWorks currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "diary-text-editor" && (
        <DiaryTextEditor
          appData={appData}
          diaries={diaryList}
          diaryId={openedDiaryId}
          setAppData={setAppData}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  )
}

export default App

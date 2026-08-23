import { useState } from 'react'
import './App.css'
import AddPerson from './pages/add-person/AddPerson'
import CreateDiary from './pages/create-diary/CreateDiary'
import EditDiary from './pages/edit-diary/EditDiary'
import EditPerson from './pages/edit-person/EditPerson'
import Home from './pages/home/Home'
import HowItWorks from './pages/how-it-works/HowItWorks'
import MyShelf from './pages/my-shelf/MyShelf'
import People from './pages/people/People'
import DiaryTextEditor from './pages/diary-text-editor/DiaryTextEditor'
import { diaries as previewDiaries } from './static preview/diaries'
import { people as previewPeople } from './static preview/people'

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [diaryList, setDiaryList] = useState(previewDiaries)
  const [peopleList, setPeopleList] = useState(previewPeople)
  const [editingDiaryId, setEditingDiaryId] = useState(null)
  const [openedDiaryId, setOpenedDiaryId] = useState(null)
  const [editingPersonId, setEditingPersonId] = useState(null)

  function saveDiaryChanges(updatedDiary) {
    setDiaryList((currentDiaries) =>
      currentDiaries.map((diary) => {
        if (diary.id === updatedDiary.id) {
          return updatedDiary
        }

        return diary
      }),
    )
  }

  function savePersonChanges(updatedPerson) {
    setPeopleList((currentPeople) =>
      currentPeople.map((person) => {
        if (person.id === updatedPerson.id) {
          return updatedPerson
        }

        return person
      }),
    )
  }

  return (
    <>
      {currentPage === "home" && (
        <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "create-diary" && (
        <CreateDiary currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "edit-diary" && (
        <EditDiary
          diaryId={editingDiaryId}
          diaries={diaryList}
          saveDiaryChanges={saveDiaryChanges}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "add-person" && (
        <AddPerson currentPage="people" setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "edit-person" && (
        <EditPerson
          people={peopleList}
          personId={editingPersonId}
          savePersonChanges={savePersonChanges}
          setCurrentPage={setCurrentPage}
        />
      )}
      {currentPage === "my-shelf" && (
        <MyShelf
          currentPage={currentPage}
          diaries={diaryList}
          setCurrentPage={setCurrentPage}
          setEditingDiaryId={setEditingDiaryId}
          setOpenedDiaryId={setOpenedDiaryId}
        />
      )}
      {currentPage === "people" && (
        <People
          currentPage={currentPage}
          people={peopleList}
          setCurrentPage={setCurrentPage}
          setEditingPersonId={setEditingPersonId}
        />
      )}
      {currentPage === "how-it-works" && (
        <HowItWorks currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "diary-text-editor" && (
        <DiaryTextEditor
          diaries={diaryList}
          diaryId={openedDiaryId}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  )
}

export default App

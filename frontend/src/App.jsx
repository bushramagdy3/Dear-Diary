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
import { appData } from './data'

const diaries = appData.diaries
const people = appData.people

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [diaryList, setDiaryList] = useState(diaries)
  const [peopleList, setPeopleList] = useState(people)
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

  function deleteDiary(diaryId) {
    setDiaryList((currentDiaries) =>
      currentDiaries.filter((diary) => diary.id !== diaryId),
    )

    if (editingDiaryId === diaryId) {
      setEditingDiaryId(null)
    }

    if (openedDiaryId === diaryId) {
      setOpenedDiaryId(null)
    }
  }

  function deletePerson(personId) {
    setPeopleList((currentPeople) =>
      currentPeople.filter((person) => person.id !== personId),
    )

    if (editingPersonId === personId) {
      setEditingPersonId(null)
    }
  }

  return (
    <>
      {currentPage === "home" && (
        <Home currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "create-diary" && (
        <CreateDiary 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          diaryList={diaryList} 
          setDiaryList = {setDiaryList}
        />
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
        <AddPerson
          currentPage="people"
          peopleList={peopleList}
          setCurrentPage={setCurrentPage}
          setPeopleList={setPeopleList}
        />
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
          deleteDiary={deleteDiary}
        />
      )}
      {currentPage === "people" && (
        <People
          currentPage={currentPage}
          people={peopleList}
          setCurrentPage={setCurrentPage}
          setEditingPersonId={setEditingPersonId}
          deletePerson={deletePerson}
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

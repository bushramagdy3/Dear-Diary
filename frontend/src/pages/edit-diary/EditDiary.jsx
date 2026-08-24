import { useState } from 'react'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import cover0 from '../../assets/journal-covers/0.png'
import cover1 from '../../assets/journal-covers/1.png'
import cover2 from '../../assets/journal-covers/2.png'
import cover3 from '../../assets/journal-covers/3.png'
import cover4 from '../../assets/journal-covers/4.png'
import cover5 from '../../assets/journal-covers/5.png'
import cover6 from '../../assets/journal-covers/6.png'
import cover7 from '../../assets/journal-covers/7.png'
import cover8 from '../../assets/journal-covers/8.png'
import '../create-diary/CreateDiary.css'

const coverOptions = [
  { id: 0, image: cover0 },
  { id: 1, image: cover1 },
  { id: 2, image: cover2 },
  { id: 3, image: cover3 },
  { id: 4, image: cover4 },
  { id: 5, image: cover5 },
  { id: 6, image: cover6 },
  { id: 7, image: cover7 },
  { id: 8, image: cover8 },
]

function EditDiary({ appData, diaryId, diaries, setAppData, setCurrentPage }) {
  const diary = diaries.find((item) => item.id === diaryId) || {
    id: '',
    title: 'My diary',
    content: '',
    coverId: 0,
  }

  const [selectedCoverId, setSelectedCoverId] = useState(diary.coverId)
  const [diaryTitle, setDiaryTitle] = useState(diary.title)

  const selectedCover = coverOptions.find((cover) => cover.id === selectedCoverId) || coverOptions[0]

  function chooseCover(coverId) {
    setSelectedCoverId(coverId)
  }

  function updateDiaryTitle(event) {
    setDiaryTitle(event.target.value)
  }

  function goToMyShelf() {
    setCurrentPage('my-shelf')
  }

  function saveDiary() {
    const updatedDiary = {
      ...diary,
      coverId: selectedCoverId,
      title: diaryTitle.trim() || 'Untitled diary',
    }

    const updatedAppData = {
      ...appData,
      diaries: appData.diaries.map((currentDiary) => {
        if (currentDiary.id === updatedDiary.id) {
          return updatedDiary
        }

        return currentDiary
      }),
    }

    setAppData(updatedAppData)
    console.log(updatedAppData)
    setCurrentPage('my-shelf')
  }

  return (
    <div className="create-page">
      <Header currentPage="my-shelf" setCurrentPage={setCurrentPage} />

      <main className="create-main">
        <section className="create-form-panel">
          <button className="create-back-button" onClick={goToMyShelf} type="button">
            &larr; Back to my shelf
          </button>

          <h1 className="create-title">Edit diary</h1>
          <p className="create-subtitle">
            Update the cover or name for this diary.
          </p>

          <div className="create-cover-grid">
            {coverOptions.map((cover) => {
              const isSelected = selectedCoverId === cover.id

              return (
                <button
                  className={`create-cover-button ${isSelected ? 'create-cover-button--selected' : ''}`}
                  key={cover.id}
                  onClick={() => chooseCover(cover.id)}
                  type="button"
                >
                  <img src={cover.image} alt={`Diary cover ${cover.id + 1}`} />
                  {isSelected && <span>Selected</span>}
                </button>
              )
            })}
          </div>

          <label className="create-name-label" htmlFor="diary-name">
            Diary name
          </label>
          <input
            className="create-name-input"
            id="diary-name"
            onChange={updateDiaryTitle}
            type="text"
            value={diaryTitle}
          />

          <div className="create-actions">
            <button className="create-action create-action--primary" onClick={saveDiary} type="button">
              Save changes
            </button>
            <button className="create-action create-action--secondary" onClick={goToMyShelf} type="button">
              Cancel
            </button>
          </div>
        </section>

        <section className="create-preview-panel">
          <div className="create-preview-cover">
            <img src={selectedCover.image} alt="Selected diary cover preview" />
            <p className={`create-preview-title preview-title-with-cover${selectedCoverId}`}>
              {diaryTitle || 'Untitled diary'}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default EditDiary

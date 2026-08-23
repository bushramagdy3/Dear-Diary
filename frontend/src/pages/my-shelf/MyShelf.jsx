import { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi'
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
import './MyShelf.css'

const coverImages = {
  0: cover0,
  1: cover1,
  2: cover2,
  3: cover3,
  4: cover4,
  5: cover5,
  6: cover6,
  7: cover7,
  8: cover8,
}

function MyShelf({ currentPage, diaries, setCurrentPage, setEditingDiaryId, setOpenedDiaryId }) {
  const diariesPerPage = 4
  const [firstDiaryIndex, setFirstDiaryIndex] = useState(0)
  const [hoveredDiaryId, setHoveredDiaryId] = useState(null)

  const lastDiaryIndex = firstDiaryIndex + diariesPerPage
  const visibleDiaries = diaries.slice(firstDiaryIndex, lastDiaryIndex)
  const canGoBack = firstDiaryIndex > 0
  const canGoForward = lastDiaryIndex < diaries.length
  const shelfIsEmpty = diaries.length === 0

  function getCoverImage(coverId) {
    return coverImages[coverId] || coverImages[0]
  }

  function getDiaryTitle(diary) {
    return diary.title || 'Untitled diary'
  }

  function showPreviousDiaries() {
    const previousIndex = firstDiaryIndex - diariesPerPage

    if (previousIndex < 0) {
      setFirstDiaryIndex(0)
      return
    }

    setFirstDiaryIndex(previousIndex)
  }

  function showNextDiaries() {
    const nextIndex = firstDiaryIndex + diariesPerPage

    if (nextIndex < diaries.length) {
      setFirstDiaryIndex(nextIndex)
    }
  }

  function openCreateDiaryPage() {
    setCurrentPage('create-diary')
  }

  function openEditDiaryPage(diaryId) {
    setEditingDiaryId(diaryId)
    setCurrentPage('edit-diary')
  }

  function openDiaryTextEditor(diaryId) {
    setOpenedDiaryId(diaryId)
    setCurrentPage('diary-text-editor')
  }

  return (
    <div className="shelf-page" id="my-shelf">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="shelf-main">
        <section className="shelf-intro">
          <h1 className="shelf-title">My shelf</h1>
          <p className="shelf-subtitle">Your diaries live only on this device.</p>

          <div className="shelf-actions">
            <button className="shelf-create" onClick={openCreateDiaryPage} type="button">
              <FiPlus className="shelf-create__icon" />
              <span>Create new diary</span>
            </button>

            <button className="shelf-export" type="button">
              Export all data
            </button>
          </div>
        </section>

        <section className="shelf-gallery">
          <div className="shelf-arrow-space">
            {canGoBack && (
              <button className="shelf-arrow" onClick={showPreviousDiaries} type="button">
                <FiChevronLeft />
              </button>
            )}
          </div>

          {shelfIsEmpty && <p className="shelf-is-empty-note">Your shelf is empty. Create your first diary!</p>}

          {!shelfIsEmpty && (
            <div className="shelf-diary-grid">
              {visibleDiaries.map((diary) => (
                <div
                  className="shelf-diary-card"
                  key={diary.id}
                  onMouseEnter={() => setHoveredDiaryId(diary.id)}
                  onMouseLeave={() => setHoveredDiaryId(null)}
                >
                  <button
                    className={`shelf-diary ${diary.id === hoveredDiaryId ? 'shelf-diary--hovered' : ''}`}
                    onBlur={() => setHoveredDiaryId(null)}
                    onClick={() => openDiaryTextEditor(diary.id)}
                    onFocus={() => setHoveredDiaryId(diary.id)}
                    type="button"
                  >
                    <img
                      src={getCoverImage(diary.coverId)}
                      alt={`${getDiaryTitle(diary)} diary cover`}
                    />
                    <span className={`shelf-diary-title title-with-cover${diary.coverId}`}>
                      {getDiaryTitle(diary)}
                    </span>
                  </button>

                  <div className={`shelf-diary-actions ${diary.id === hoveredDiaryId ? 'shelf-diary-actions--hovered' : ''}`}>
                    <button
                      className="shelf-diary-link"
                      onBlur={() => setHoveredDiaryId(null)}
                      onClick={() => openDiaryTextEditor(diary.id)}
                      onFocus={() => setHoveredDiaryId(diary.id)}
                      type="button"
                    >
                      Open
                    </button>
                    <button
                      className="shelf-diary-link"
                      onBlur={() => setHoveredDiaryId(null)}
                      onClick={() => openEditDiaryPage(diary.id)}
                      onFocus={() => setHoveredDiaryId(diary.id)}
                      type="button"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="shelf-arrow-space">
            {canGoForward && (
              <button className="shelf-arrow" onClick={showNextDiaries} type="button">
                <FiChevronRight />
              </button>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default MyShelf

import { FiCheck, FiChevronLeft, FiDownload, FiPlus } from 'react-icons/fi'
import './DiaryTextEditor.css'
import Tiptap from '../../components/tiptap/Tiptap'
import { useState } from 'react'

function DiaryTextEditor({ diaries, diaryId, setCurrentPage }) {
  const diary = diaries.find((item) => item.id === diaryId) || diaries[0] || {
    title: 'Untitled diary',
    entries: [],
  }

  const [currentEntry, setCurrentEntry] = useState(0)

  const selectedEntry = diary.entries[currentEntry]

  function getEntryListDate(dateText) {
    const dateParts = dateText.split(' ')

    if (dateParts.length < 2) {
      return dateText
    }

    return `${dateParts[0]} ${dateParts[1].slice(0, 3).toUpperCase()}`
  }

  function goToMyShelf() {
    setCurrentPage('my-shelf')
  }

  return (
    <div className="diary-editor-page">
      <header className="diary-editor-topbar">
        <div className="diary-editor-topbar__left">
          <button className="diary-editor-back" onClick={goToMyShelf} type="button">
            <FiChevronLeft />
            <span>My shelf</span>
          </button>
          <h1 className="diary-editor-diary-title">{diary.title || 'Untitled diary'}</h1>
        </div>

        <div className="diary-editor-topbar__right">
          <p className="diary-editor-saved">
            <FiCheck />
            <span>Saved on this device</span>
          </p>
          <button className="diary-editor-export" type="button">
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </header>

      <main className="diary-editor-main">
        <aside className="diary-editor-sidebar">
          <div className="diary-editor-sidebar__header">
            <h2>Entries</h2>
            <button className="diary-editor-collapse" type="button">
              <FiChevronLeft />
            </button>
          </div>

          <button className="diary-editor-new-entry" type="button">
            <FiPlus />
            <span>New entry</span>
          </button>

          <div className="diary-editor-entry-list">
            {diary.entries.map((entry, index) => (
              <div className="diary-editor-entry-item" key={entry.id}>
                <button 
                  className="diary-editor-entry-button"
                  onClick={() => setCurrentEntry(index)} 
                  disabled={currentEntry === index} 
                  type="button"
                >
                  <span className="diary-editor-entry-date">
                    {getEntryListDate(entry.created_at)}
                  </span>
                  <span className="diary-editor-entry-name">{entry.name}</span>
                </button>
              </div>
            ))}
          </div>
        </aside>

        <section className="diary-editor-workspace">
          <div className="diary-editor-blank-sheet">
            {selectedEntry != null && (
              <>
                <div className="diary-current-entry-header">
                  <p>{selectedEntry.created_at}</p>
                  <h2>{selectedEntry.name}</h2>
                </div>
                <Tiptap key={selectedEntry.id} entry={selectedEntry}/>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default DiaryTextEditor

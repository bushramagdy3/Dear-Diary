import { FiCheck, FiChevronLeft, FiDownload, FiPlus } from 'react-icons/fi'
import './DiaryTextEditor.css'

function DiaryTextEditor({ diaries, diaryId, setCurrentPage }) {
  const diary = diaries.find((item) => item.id === diaryId) || diaries[0] || {
    title: 'Untitled diary',
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

          <div className="diary-editor-entry-list"></div>
        </aside>

        <section className="diary-editor-workspace">
          <div className="diary-editor-blank-sheet"></div>
        </section>
      </main>
    </div>
  )
}

export default DiaryTextEditor

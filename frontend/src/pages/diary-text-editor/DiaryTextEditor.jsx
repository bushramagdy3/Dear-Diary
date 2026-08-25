import {FiChevronLeft, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi'
import './DiaryTextEditor.css'
import Tiptap from '../../components/tiptap/Tiptap'
import { useEffect, useRef, useState } from 'react'
import { formatDate } from '../../utils'

function DiaryTextEditor({ appData, diaries, diaryId, setAppData, setCurrentPage }) {
  const diary = diaries.find((item) => item.id === diaryId) || diaries[0] || {
    title: 'Untitled diary',
    entries: [],
  }

  const [currentEntry, setCurrentEntry] = useState(0)
  const [isAddNewEntry, setIsAddNewEntry] = useState(false)
  const [entries, setEntries] = useState(diary.entries)
  const [editingEntryIndex, setEditingEntryIndex] = useState(null)
  const [editedEntryName, setEditedEntryName] = useState('')
  const newEntryInputRef = useRef(null)
  const editEntryInputRef = useRef(null)

  const selectedEntry = entries[currentEntry]

  useEffect(() => {
    if (isAddNewEntry) {
      newEntryInputRef.current.focus()
    }
  }, [isAddNewEntry])

  useEffect(() => {
    if (editingEntryIndex != null){
      editEntryInputRef.current.focus()
    }
  }, [editingEntryIndex])

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

  function showNewEntryInput() {
    setIsAddNewEntry(true)
  }

  function addNewEntry(event){
    if(event.key !== 'Enter')
      return
    const now = new Date()
    const newEntry = {
      id: crypto.randomUUID(),
      name: event.target.value,
      created_at: formatDate(now.getDate(), now.getMonth() + 1, now.getFullYear()),
      content: {
        "type": "doc",
        "content": [
            {
                "type": "paragraph",
                "attrs": {
                    "textAlign": null
                },
                "content": [
                    {
                        "type": "text",
                        "text": "Start writing about your day..."
                    }
                ]
            }
        ]
      }
    }
    const updatedEntries = [...entries, newEntry]
    const updatedAppData = {
      ...appData,
      diaries: appData.diaries.map((currentDiary) => {
        if (currentDiary.id === diary.id) {
          return {
            ...currentDiary,
            entries: updatedEntries,
          }
        }

        return currentDiary
      }),
    }

    setEntries(updatedEntries)
    setAppData(updatedAppData)
    setCurrentEntry(entries.length)
    setIsAddNewEntry(false)
  }

  function deleteEntry(entryIndex) {
    const updatedEntries = entries.filter((entry, index) => index !== entryIndex)
    const updatedAppData = {
      ...appData,
      diaries: appData.diaries.map((currentDiary) => {
        if (currentDiary.id === diary.id) {
          return {
            ...currentDiary,
            entries: updatedEntries,
          }
        }

        return currentDiary
      }),
    }

    setEntries(updatedEntries)
    setAppData(updatedAppData)

    if (updatedEntries.length === 0) {
      setCurrentEntry(0)
      return
    }

    if (entryIndex < currentEntry) {
      setCurrentEntry(currentEntry - 1)
      return
    }

    if (entryIndex === currentEntry && entryIndex >= updatedEntries.length) {
      setCurrentEntry(updatedEntries.length - 1)
    }
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
            <span>Saved on this device only</span>
          </p>
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

          <button 
            className="diary-editor-new-entry" 
            type="button" 
            onClick={showNewEntryInput}
          >
            <FiPlus />
            <span>New entry</span>
          </button>

          <div className="diary-editor-entry-list">
            {entries.map((entry, index) => {
              if(editingEntryIndex != index)
                return(
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
                    <button
                      className="diary-editor-delete-entry"
                      onClick={() => deleteEntry(index)}
                      title="Delete entry"
                      type="button"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      className="diary-editor-edit-entry"
                      onClick={() => {
                        setEditingEntryIndex(index)
                        setEditedEntryName(entry.name)
                      }}
                      title="Edit entry"
                      type="button"
                    >
                      <FiEdit2 />
                    </button>
                  </div>)
              return (
                <div className="diary-editor-entry-item" key={entry.id}>
                  <div 
                    className="diary-editor-entry-button diary-editor-entry-button--draft" 
                  >
                    <span className="diary-editor-entry-date">
                      {formatDate(
                        new Date().getDate(), 
                        new Date().getMonth() + 1, 
                        new Date().getFullYear()
                      )}
                    </span>
                    <input
                      className="diary-editor-entry-name diary-editor-new-entry-input"
                      onKeyDown={(event) =>{ 
                        if(event.key == "Enter"){
                          const updatedAppData = {... appData}
                          updatedAppData.diaries.forEach(element => {
                            if(element.id == diaryId){
                              element.entries.forEach((item, index) => {
                                if(index == editingEntryIndex){
                                  if(editedEntryName === "")
                                    item.name = "Untitled Entry"
                                  else
                                    item.name = editedEntryName
                                }
                              });
                            }
                          });
                          setAppData(updatedAppData)
                          setEditingEntryIndex(null)
                          setEditedEntryName('')
                        }
                      }}
                      onChange={(event) => setEditedEntryName(event.target.value)}
                      onBlur={() => {
                        setEditingEntryIndex(null)
                        setEditedEntryName('')
                      }}
                      value={editedEntryName}
                      type="text"
                      ref={editEntryInputRef}
                    />
                  </div>
                </div>)
            })}
            {isAddNewEntry &&
              <div className="diary-editor-entry-item">
                <div 
                  className="diary-editor-entry-button diary-editor-entry-button--draft" 
                >
                  <span className="diary-editor-entry-date">
                    {formatDate(
                      new Date().getDate(), 
                      new Date().getMonth() + 1, 
                      new Date().getFullYear()
                    )}
                  </span>
                  <input
                    className="diary-editor-entry-name diary-editor-new-entry-input"
                    onKeyDown={addNewEntry}
                    onBlur={() => setIsAddNewEntry(false)}
                    placeholder="Entry title"
                    ref={newEntryInputRef}
                    type="text"
                  />
                </div>
              </div>
            }
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
                <Tiptap 
                  key={selectedEntry.id} 
                  appData={appData}
                  diaryId={diary.id} 
                  entry={selectedEntry}
                  setAppData={setAppData}
                />
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default DiaryTextEditor

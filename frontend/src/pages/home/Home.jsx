import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import { FiLock } from 'react-icons/fi'
import './Home.css'
import { deserializeBackup } from '../../utils'
import { useState } from 'react'

function Home({ currentPage, setCurrentPage, appData, setAppData}) {
  const [importPopup, setImportPopup] = useState(null)

  function showImportPopup(type, message) {
    setImportPopup({
      type: type,
      message: message
    })

    setTimeout(() => {
      setImportPopup(null)
    }, 3200)
  }

  function validateImportedData(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('This file is not a valid Dear Diary backup.')
    }

    if (data.name !== 'appData') {
      throw new Error('This backup does not belong to Dear Diary.')
    }

    if (!Array.isArray(data.diaries) || !Array.isArray(data.people)) {
      throw new Error('This backup is missing diaries or people.')
    }
  }

  async function handleImport(event){
    try {
      const file = event.target.files[0]
      if(!file)
        return

      const parsedData = JSON.parse(await file.text())
      validateImportedData(parsedData)

      const data = deserializeBackup(parsedData)
      setAppData(data)
      showImportPopup('success', 'Backup imported successfully.')
    } catch (error) {
      showImportPopup('error', error.message || 'Could not import this backup.')
    }

    event.target.value = ''
  }

  return (
    <div className="home-page" id="home">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} appData={appData}/>

      <main className="home-hero">
        <section className="home-hero__content">
          <h1 className="home-hero__title">
            <span>Turn ordinary</span>
            <span>days into</span>
            <em>illustrated</em>
            <span>memories.</span>
          </h1>

          <p className="home-hero__copy">
            Write privately. Illustrate the
            moments worth remembering.
          </p>

          <div className="home-hero__actions">
            <button
              className="home-button home-button--primary"
              onClick={() => setCurrentPage('create-diary')}
              type="button"
            >
              Create diary
            </button>
            <label className="home-button home-button--secondary">
              Import Backup
              <input   
                onChange={handleImport}
                type="file"
                accept=".json,application/json"
              />
            </label>
            
          </div>

          <p className="home-hero__privacy">
            <FiLock className="home-hero__lock" />
            <span>Stored only on this device.</span>
          </p>
        </section>
      </main>

      {importPopup && (
        <div className={`home-import-popup home-import-popup--${importPopup.type}`}>
          {importPopup.message}
        </div>
      )}

      <Footer />
    </div>
  )
}

export default Home

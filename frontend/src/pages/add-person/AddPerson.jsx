import { useState } from 'react'
import { FiImage, FiStar } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import anonymousFigure from '../../assets/add-person/portrait-anonymous-figure.png'
import emptyCard from '../../assets/add-person/portrait-empty-card.png'
import './AddPerson.css'

function AddPerson({ currentPage, setCurrentPage }) {
  const [portraitMode, setPortraitMode] = useState('upload')
  const generatedPortrait = ''

  function goToPeople() {
    setCurrentPage('people')
  }

  return (
    <div className="add-person-page">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="add-person-main">
        <section className="add-person-form">
          <button className="add-person-back" onClick={goToPeople} type="button">
            &larr; Back to people
          </button>

          <h1 className="add-person-title">Add someone</h1>
          <p className="add-person-subtitle">
            Create a character your diary can remember and illustrate.
          </p>

          <label className="add-person-label" htmlFor="person-name">
            Name
          </label>
          <input
            className="add-person-input"
            id="person-name"
            placeholder="Their name"
            type="text"
          />

          <label className="add-person-label" htmlFor="person-relationship">
            Relationship
          </label>
          <select className="add-person-input" id="person-relationship">
            <option>Choose relationship</option>
            <option>Friend</option>
            <option>Family</option>
            <option>Partner</option>
            <option>Classmate</option>
            <option>Other</option>
          </select>

          <label className="add-person-label" htmlFor="person-description">
            Description
          </label>
          <textarea
            className="add-person-description"
            id="person-description"
            maxLength="1000"
            placeholder="Describe their appearance, personality, style, and anything the AI should remember..."
          />

          <p className="add-person-count">0 / 1000</p>

          <div className="add-person-actions">
            <button className="add-person-cancel" onClick={goToPeople} type="button">
              Cancel
            </button>
            <button className="add-person-save" onClick={goToPeople} type="button">
              Save person
            </button>
          </div>
        </section>

        <section className="add-person-portrait">
          <h2 className="portrait-title">Create their portrait</h2>

          <div className="portrait-tabs">
            <button
              className={`portrait-tab ${portraitMode === 'upload' ? 'portrait-tab--active' : ''}`}
              onClick={() => setPortraitMode('upload')}
              type="button"
            >
              Upload an image
            </button>
            <button
              className={`portrait-tab ${portraitMode === 'describe' ? 'portrait-tab--active' : ''}`}
              onClick={() => setPortraitMode('describe')}
              type="button"
            >
              Describe in words
            </button>
          </div>

          <div className="portrait-workspace">
            {portraitMode === 'upload' && (
              <div className="portrait-upload-box">
                <FiImage className="portrait-upload-icon" />
                <p>Drop an image here</p>
                <button className="portrait-choose-button" type="button">
                  Choose image
                </button>
                <span>PNG or JPG · up to 10 MB</span>
              </div>
            )}

            {portraitMode === 'describe' && (
              <textarea
                className="portrait-words-box"
                placeholder="Describe their face, hair, clothes, expression, and overall style..."
              />
            )}

            <div className="portrait-preview-area">
              <div className="portrait-placeholder-card">
                <img className="portrait-empty-card-image" src={emptyCard} alt="" />

                <div className="portrait-card-content">
                  {generatedPortrait ? (
                    <img
                      className="portrait-result-image"
                      src={generatedPortrait}
                      alt="Generated portrait"
                    />
                  ) : (
                    <>
                      <img className="portrait-placeholder-figure" src={anonymousFigure} alt="" />
                      <p>Your generated portrait will appear here</p>
                    </>
                  )}
                </div>
              </div>

              <button className="portrait-generate-button" type="button">
                <FiStar />
                <span>Generate portrait</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AddPerson

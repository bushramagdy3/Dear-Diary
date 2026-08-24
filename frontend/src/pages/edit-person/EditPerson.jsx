import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { IoSparklesSharp } from 'react-icons/io5'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import emptyCard from '../../assets/add-person/portrait-empty-card.png'
import person0 from '../../assets/static/0.png'
import person1 from '../../assets/static/1.png'
import '../add-person/AddPerson.css'

const personImages = {
  0: person0,
  1: person1,
}

function EditPerson({ appData, people, personId, setAppData, setCurrentPage }) {
  const person = people.find((item) => item.id === personId) || {
    id: '',
    name: '',
    relationship: '',
    description: '',
    imageId: 0,
  }

  const [portraitMode, setPortraitMode] = useState('upload')
  const [personName, setPersonName] = useState(person.name)
  const [personRelationship, setPersonRelationship] = useState(person.relationship)
  const [personDescription, setPersonDescription] = useState(person.description)

  const portraitImage = personImages[person.imageId] || personImages[0]

  function goToPeople() {
    setCurrentPage('people')
  }

  function updatePersonName(event) {
    setPersonName(event.target.value)
  }

  function updatePersonRelationship(event) {
    setPersonRelationship(event.target.value)
  }

  function updatePersonDescription(event) {
    setPersonDescription(event.target.value)
  }

  function savePerson() {
    const updatedPerson = {
      ...person,
      name: personName.trim() || 'Unnamed person',
      relationship: personRelationship || 'other',
      description: personDescription.trim(),
    }

    const updatedAppData = {
      ...appData,
      people: appData.people.map((currentPerson) => {
        if (currentPerson.id === updatedPerson.id) {
          return updatedPerson
        }

        return currentPerson
      }),
    }

    setAppData(updatedAppData)
    console.log(updatedAppData)
    setCurrentPage('people')
  }

  return (
    <div className="add-person-page">
      <Header currentPage="people" setCurrentPage={setCurrentPage} />

      <main className="add-person-main">
        <section className="add-person-form">
          <button className="add-person-back" onClick={goToPeople} type="button">
            &larr; Back to people
          </button>

          <h1 className="add-person-title">Edit person</h1>
          <p className="add-person-subtitle">
            Update the details your diary uses for this character.
          </p>

          <label className="add-person-label" htmlFor="person-name">
            Name
          </label>
          <input
            className="add-person-input"
            id="person-name"
            onChange={updatePersonName}
            placeholder="Their name"
            type="text"
            value={personName}
          />

          <label className="add-person-label" htmlFor="person-relationship">
            Relationship
          </label>
          <select
            className="add-person-input"
            id="person-relationship"
            onChange={updatePersonRelationship}
            value={personRelationship}
          >
            <option value="">Choose relationship</option>
            <option value="friend">Friend</option>
            <option value="family">Family</option>
            <option value="partner">Partner</option>
            <option value="classmate">Classmate</option>
            <option value="other">Other</option>
          </select>

          <label className="add-person-label" htmlFor="person-description">
            Description
          </label>
          <textarea
            className="add-person-description"
            id="person-description"
            maxLength="1000"
            onChange={updatePersonDescription}
            placeholder="Describe their appearance, personality, style, and anything the AI should remember..."
            value={personDescription}
          />

          <p className="add-person-count">{personDescription.length} / 1000</p>

          <div className="add-person-actions">
            <button className="add-person-cancel" onClick={goToPeople} type="button">
              Cancel
            </button>
            <button className="add-person-save" onClick={savePerson} type="button">
              Save changes
            </button>
          </div>
        </section>

        <section className="add-person-portrait">
          <h2 className="portrait-title">Edit their portrait</h2>

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
                <span>PNG or JPG - up to 10 MB</span>
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
                  <img
                    className="portrait-result-image"
                    src={portraitImage}
                    alt={`${personName || 'Saved person'} portrait`}
                  />
                </div>
              </div>

              <button className="portrait-generate-button" type="button">
                <IoSparklesSharp />
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

export default EditPerson

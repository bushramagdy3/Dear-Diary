import { useState } from 'react'
import { FiImage } from 'react-icons/fi'
import { IoSparklesSharp } from 'react-icons/io5'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import emptyCard from '../../assets/add-person/portrait-empty-card.png'
import '../add-person/AddPerson.css'
import anonymousFigure from '../../assets/add-person/portrait-anonymous-figure.png'
import { blobToBase64 } from '../../utils'

function EditPerson({ appData, people, personId, setAppData, setCurrentPage }) {

  const person = people.find((item) => item.id === personId) || {
    id: '',
    name: '',
    relationship: '',
    description: '',
    relationshipDescription: '',
    referencePhotoBlob: null,
    is_user: false,
    portraitBlob: null,
  }

  const startingPortraitMode = person.referencePhotoBlob ? 'upload' : 'describe'

  const [portraitMode, setPortraitMode] = useState(startingPortraitMode)
  const [personName, setPersonName] = useState(person.name || '')
  const [personRelationship, setPersonRelationship] = useState(person.relationship || '')
  const [personDescription, setPersonDescription] = useState(person.description || '')
  const [relationshipDescription, setRelationshipDescription] = useState(person.relationshipDescription || '')
  const [uploadedImageBlob, setUploadedImageBlob] = useState(person.referencePhotoBlob || null)
  const [isUser, setIsUser] = useState(Boolean(person.is_user) || person.relationship === 'user')
  const [currentBlob, setCurrentBlob] = useState(person.portraitBlob)
  const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false)
  const [portraitError, setPortraitError] = useState('')

  let canGeneratePortrait = false

  if(portraitMode === 'upload' && uploadedImageBlob != null){
    canGeneratePortrait = true
  }

  if(portraitMode === 'describe' && personDescription.trim() !== ''){
    canGeneratePortrait = true
  }

  function goToPeople() {
    setCurrentPage('people')
  }

  function updatePersonName(event) {
    setPersonName(event.target.value)
  }

  function updatePersonRelationship(event) {
    const newRelationship = event.target.value == "Me" ? "user" : event.target.value

    setPersonRelationship(newRelationship)

    if(newRelationship === 'user'){
      setIsUser(true)
      return
    }

    setIsUser(false)
  }

  function updateIsUser(event) {
    const checked = event.target.checked

    setIsUser(checked)

    if(checked){
      setPersonRelationship('user')
      return
    }

    if(personRelationship === 'user'){
      setPersonRelationship('')
    }
  }

  function updateRelationshipDescription(event) {
    setRelationshipDescription(event.target.value)
  }

  function updatePersonDescription(event) {
    setPersonDescription(event.target.value)
  }

  function updateUploadedImage(event) {
    const file = event.target.files[0]

    if(file){
      setUploadedImageBlob(file)
    }
  }

  function savePerson() {
    const updatedPerson = {
      ...person,
      name: personName.trim() || 'Unnamed person',
      relationship: isUser ? 'user' : personRelationship || 'other',
      is_user: isUser,
      relationshipDescription: relationshipDescription.trim(),
      description: personDescription.trim(),
      referencePhotoBlob: uploadedImageBlob,
      portraitBlob: currentBlob,
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
    setCurrentPage('people')
  }

  async function handleRegenerateButton(){
    if(canGeneratePortrait == false){
      return
    }

    setIsGeneratingPortrait(true)
    setPortraitError('')

    try {
      let description = null
      let referenceImagePath = null

      if(portraitMode === 'describe'){
        description = personDescription
      }

      if(portraitMode === 'upload'){
        referenceImagePath = await blobToBase64(uploadedImageBlob)
      }

      fetch('http://127.0.0.1:8000/portraits/generate', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
          description: description,
          reference_image_path: referenceImagePath
        })
      })
        .then((response) => {
          if(!response.ok)
            throw new Error("cannot fetch")
          return response.blob()
        })
        .then((data) => {
          setCurrentBlob(data)
          setPortraitError('')
        })
        .catch((message) => {
          setPortraitError('Something went wrong while generating this portrait.')
          console.error(message)
        })
        .finally(() => {
          setIsGeneratingPortrait(false)
        })
    } catch (message) {
      setPortraitError('Something went wrong while generating this portrait.')
      setIsGeneratingPortrait(false)
      console.error(message)
    }
  }

  const showPortraitLoading = isGeneratingPortrait
  const showPortraitError = portraitError !== '' && isGeneratingPortrait == false
  const showPortraitImage = currentBlob != null && showPortraitLoading == false && showPortraitError == false
  const showPortraitPlaceholder = currentBlob == null && showPortraitLoading == false && showPortraitError == false
  const portraitCardClass = showPortraitLoading || showPortraitError
    ? 'portrait-placeholder-card portrait-placeholder-card--status'
    : 'portrait-placeholder-card'
  const portraitContentClass = showPortraitLoading || showPortraitError
    ? 'portrait-card-content portrait-card-content--status'
    : 'portrait-card-content'

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
            <option value="user">Me</option>
            <option value="friend">Friend</option>
            <option value="family">Family</option>
            <option value="partner">Partner</option>
            <option value="classmate">Classmate</option>
            <option value="other">Other</option>
          </select>

          <label className="add-person-checkbox">
            <input
              checked={isUser}
              onChange={updateIsUser}
              type="checkbox"
            />
            <span>This person is me</span>
          </label>

          <label className="add-person-label" htmlFor="person-relationship-description">
            Relationship note
          </label>
          <textarea
            className="add-person-description"
            id="person-relationship-description"
            maxLength="1000"
            onChange={updateRelationshipDescription}
            placeholder="Write how this person fits into your life..."
            value={relationshipDescription}
          />

          <p className="add-person-count">{relationshipDescription.length} / 1000</p>

          <div className="add-person-actions">
            <button className="add-person-cancel" onClick={goToPeople} type="button">
              Cancel
            </button>
            <button className="add-person-save" onClick={savePerson} type="button" disabled={personName === ''}>
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
                <input
                  accept="image/png, image/jpeg"
                  className="portrait-file-input"
                  id="portrait-upload-image"
                  onChange={updateUploadedImage}
                  type="file"
                />
                <label className="portrait-choose-button" htmlFor="portrait-upload-image">
                  Choose image
                </label>
                <span>{uploadedImageBlob ? uploadedImageBlob.name || 'Image selected' : 'PNG or JPG - up to 10 MB'}</span>
              </div>
            )}

            {portraitMode === 'describe' && (
              <div className="portrait-words-wrap">
                <textarea
                  className="portrait-words-box"
                  maxLength="1000"
                  onChange={updatePersonDescription}
                  placeholder="Describe their appearance, style, expression, and anything the AI should remember..."
                  value={personDescription}
                />
                <p className="portrait-words-count">{personDescription.length} / 1000</p>
              </div>
            )}

            <div className="portrait-preview-area">
              <div className={portraitCardClass}>
                <img className="portrait-empty-card-image" src={emptyCard} alt="" />

                <div className={portraitContentClass}>
                  {showPortraitLoading && (
                    <div className="portrait-status-card">
                      <div className="portrait-status-spinner"></div>
                      <p>Creating their portrait...</p>
                      <span>This may take a moment.</span>
                    </div>
                  )}

                  {showPortraitError && (
                    <div className="portrait-status-card">
                      <div className="portrait-status-icon">!</div>
                      <p>{portraitError}</p>
                      <span>Please try again in a moment.</span>
                    </div>
                  )}

                  {showPortraitImage && (
                    <img
                      className="portrait-result-image"
                      src={URL.createObjectURL(currentBlob)}
                      alt={`${personName || 'Saved person'} portrait`}
                    />
                  )}

                  {showPortraitPlaceholder && (
                    <>
                      <img className="portrait-placeholder-figure" src={anonymousFigure} alt=""/>
                      <p>Your generated portrait will appear here</p>
                    </>
                  )}
                </div>
              </div>

              <button
                className="portrait-generate-button"
                disabled={canGeneratePortrait == false || isGeneratingPortrait}
                type="button"
                onClick={handleRegenerateButton}
              >
                <IoSparklesSharp />
                <span>Regenerate portrait</span>
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

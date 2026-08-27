import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

import { useEffect, useState, useRef } from 'react'
import Image from '@tiptap/extension-image'
import { FiTrash2, FiRefreshCw, FiAlertTriangle, FiUsers } from 'react-icons/fi'
import { blobToBase64 } from '../../utils'

function DiaryImageView({ node, updateAttributes, deleteNode, extension }) {
  let savedErrorMessage = node.attrs.errorMessage

  if (node.attrs.src === 'generation-error' && savedErrorMessage == null) {
    savedErrorMessage = 'This illustration could not be generated. Try again in a moment.'
  }

  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBlob, setCurrentBlob] = useState(node.attrs.blob)
  const [errorMessage, setErrorMessage] = useState(savedErrorMessage)
  const [missingPeople, setMissingPeople] = useState(node.attrs.missingPeople)
  const people = extension.options.people || []
  const setCurrentPage = extension.options.setCurrentPage
  const hasGenerated = useRef(false)

  async function handleGenerateImage() {
    try {
      setCurrentBlob(null)
      setErrorMessage(null)
      setMissingPeople(null)
      updateAttributes({
        src: '',
        blob: null,
        errorMessage: null,
        missingPeople: null
      })

      const peopleForRequest = []
      for(let i=0; i<people.length; i++){
        peopleForRequest.push({
          ...people[i],
          portraitBlob: await blobToBase64(people[i].portraitBlob)
        })
      }

      console.log("Generate", node.attrs.alt)
      fetch('http://127.0.0.1:8000/illustrations/generate', {
        headers: {
          "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
          prompt: node.attrs.alt,
          people: peopleForRequest
        })
      })
        .then(async function(response){
          if(response.status === 409){
            const error = await response.json()
            const people = error.people || []
            const message = 'I could not find everyone in this moment.'

            setCurrentBlob(null)
            setErrorMessage(message)
            setMissingPeople(people)
            updateAttributes({
              src: 'generation-error',
              blob: null,
              errorMessage: message,
              missingPeople: people
            })

            return null
          }
          if(!response.ok)
            throw new Error("cannot fetch")
          return response.blob()
        })
        .then((data) => {
          if(data == null)
            return

          setCurrentBlob(data)

          updateAttributes({
            src: '',
            blob: data,
            errorMessage: null,
            missingPeople: null
          })
        })
        .catch((message) => {
          const errorText = 'This illustration could not be generated. Try again in a moment.'

          setCurrentBlob(null)
          setErrorMessage(errorText)
          setMissingPeople([])
          updateAttributes({
            src: 'generation-error',
            blob: null,
            errorMessage: errorText,
            missingPeople: []
          })
          console.error(message)
        })
    } catch (message) {
      const errorText = 'This illustration could not be generated. Try again in a moment.'

      setCurrentBlob(null)
      setErrorMessage(errorText)
      setMissingPeople([])
      updateAttributes({
        src: 'generation-error',
        blob: null,
        errorMessage: errorText,
        missingPeople: []
      })
      console.error(message)
    }
  }

  useEffect(() => {
    if (hasGenerated.current || node.attrs.blob != null || errorMessage != null || node.attrs.src === 'generation-error')
      return
    hasGenerated.current = true
    handleGenerateImage()
  }, [])

  function openAddPeoplePage() {
    if(setCurrentPage){
      setCurrentPage('add-person')
    }
  }

  function deleteImage() {
    setIsDeleting(true)
    setTimeout(deleteNode, 220)
  }

  const wrapperClass = isDeleting
    ? 'diary-image-wrapper diary-image-wrapper--deleting'
    : 'diary-image-wrapper'

  const hasImage = currentBlob != null
  const hasError = errorMessage != null
  const isLoading = hasImage == false && hasError == false
  const hasMissingPeople = missingPeople != null && missingPeople.length > 0

  let errorTitle = 'Something went wrong while generating this illustration.'
  let errorNote = 'Please try again.'

  if(hasMissingPeople){
    errorTitle = 'Some people in this moment are missing portraits.'
    errorNote = 'Add their portraits, then try again.'
  }

  return (
    <NodeViewWrapper className={wrapperClass}>
      {hasImage && (
        <img
          className="diary-illustration"
          src={URL.createObjectURL(currentBlob)}
          alt={node.attrs.alt || ''}
        />
      )}

      {isLoading && (
        <div className="diary-image-block">
          <div className="diary-image-spinner"></div>
          <p>Turning this moment into a little sketch...</p>
          <span>This can take a few seconds.</span>
        </div>
      )}

      {hasError && (
        <div className="diary-image-block">
          <div className={hasMissingPeople ? 'diary-image-icon diary-image-missing-icon' : 'diary-image-icon diary-image-error-icon'}>
            {hasMissingPeople ? <FiUsers /> : <FiAlertTriangle />}
          </div>

          <p>{errorTitle}</p>
          <span>{errorNote}</span>

          <div className="diary-image-block-actions">
            <button className="diary-image-main-button" type="button" onClick={handleGenerateImage}>
              Try Again
            </button>

            {hasMissingPeople && (
              <button className="diary-image-light-button" type="button" onClick={openAddPeoplePage}>
                Add Missing People
              </button>
            )}
          </div>
        </div>
      )}

      {hasImage && (
        <div className="diary-image-actions">
          <button
            className="diary-image-action-button"
            title="Regenerate image"
            disabled={currentBlob == null}
            type="button"
            onClick={handleGenerateImage}
          >
            <FiRefreshCw />
          </button>

          <button
            className="diary-image-action-button"
            title="Delete image"
            type="button"
            onClick={deleteImage}
          >
            <FiTrash2 />
          </button>
        </div>
      )}

      {hasImage == false && (
        <div className="diary-image-actions diary-image-actions-corner">
          <button
            className="diary-image-action-button"
            title="Delete image"
            type="button"
            onClick={deleteImage}
          >
            <FiTrash2 />
          </button>
        </div>
      )}
    </NodeViewWrapper>
  )
}

const DiaryImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      blob: {
        default: null,
      },
      errorMessage: {
        default: null,
      },
      missingPeople: {
        default: null,
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiaryImageView)
  },
})

export default DiaryImage

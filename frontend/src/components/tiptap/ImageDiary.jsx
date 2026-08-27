import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

import { useEffect, useState, useRef } from 'react'
import Image from '@tiptap/extension-image'
import { FiTrash2, FiRefreshCw } from 'react-icons/fi'
import loadingImageSrc from '../../assets/tiptap-writing-space/dear-diary-generating.gif'
import { blobToBase64 } from '../../utils'

function DiaryImageView({ node, updateAttributes, deleteNode, extension }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBlob, setCurrentBlob] = useState(node.attrs.blob)
  const [missingPeople, setMissingPeople] = useState(null)
  const people = extension.options.people || []
  const setCurrentPage = extension.options.setCurrentPage
  const hasGenerated = useRef(false)

  async function handleGenerateImage() {
    const peopleForRequest = []
    for(let i=0; i<people.length; i++){
      peopleForRequest.push({
        ...people[i],
        portraitBlob: await blobToBase64(people[i].portraitBlob)
      })
    }
    setCurrentBlob(null)
    setMissingPeople(null)
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
          setMissingPeople(error.people || [])
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
          blob: data
        })
      })
      .catch((message) => console.error(message))
  }

  useEffect(() => {
    if (hasGenerated.current || node.attrs.blob != null)
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

  return (
    <NodeViewWrapper className={wrapperClass}>
      {missingPeople == null && (
        <img
          className="diary-illustration"
          src={currentBlob ? URL.createObjectURL(currentBlob) : loadingImageSrc}
          alt={node.attrs.alt || ''}
        />
      )}

      {missingPeople != null && (
        <div className="diary-image-error">
          <p>Missing people: {missingPeople.join(', ')}</p>
          <button type="button" onClick={openAddPeoplePage}>
            Add people
          </button>
        </div>
      )}

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
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(DiaryImageView)
  },
})

export default DiaryImage

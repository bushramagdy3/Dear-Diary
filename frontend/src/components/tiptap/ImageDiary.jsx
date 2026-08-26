import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

import { useEffect, useState } from 'react'
import Image from '@tiptap/extension-image'
import { FiTrash2, FiRefreshCw } from 'react-icons/fi'
import loadingImageSrc from '../../assets/tiptap-writing-space/dear-diary-generating.gif'

function DiaryImageView({ node, updateAttributes, deleteNode, extension }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBlob, setCurrentBlob] = useState(node.attrs.blob)
  const people = extension.options.people || []

  useEffect(() => {
    if (node.attrs.blob != null) {
      return
    }

    fetch('http://127.0.0.1:8000/illustrations/generate', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        prompt: node.attrs.alt,
        people: people
      })
    })
      .then((response) => {
        if(!response.ok)
          throw new Error("cannot fetch")
        return response.blob()
      })
      .then((data) => {
        setCurrentBlob(data)
        updateAttributes({
          src: '',
          blob: data
        })
      })
      .catch((message) => console.error(message))
  }, [])

  function handleRegenerateImage() {
    setCurrentBlob(null)
    console.log("Regenerate", node.attrs.alt)
    fetch('http://127.0.0.1:8000/illustrations/regenerate', {
      headers: {
        "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        prompt: node.attrs.alt,
        people: people
      })
    })
      .then((response) => {
        if(!response.ok)
          throw new Error("cannot fetch")
        return response.blob()
      })
      .then((data) => {
        setCurrentBlob(data)

        updateAttributes({
          src: '',
          blob: data
        })
      })
      .catch((message) => console.error(message))
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
      <img
        className="diary-illustration"
        src={currentBlob ? URL.createObjectURL(currentBlob) : loadingImageSrc}
        alt={node.attrs.alt || ''}
      />

      <div className="diary-image-actions">
        <button
          className="diary-image-action-button"
          title="Regenerate image"
          disabled={currentBlob == null}
          type="button"
          onClick={handleRegenerateImage}
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

import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

import { useEffect, useState } from 'react'
import Image from '@tiptap/extension-image'
import { FiTrash2, FiRefreshCw } from 'react-icons/fi'
import loadingImageSrc from '../../assets/tiptap-writing-space/dear-diary-generating.gif'
import testImageURL from '../../assets/static/0.png'
import { addImage } from '../../database'

function DiaryImageView({ node, updateAttributes, deleteNode }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentBlob, setCurrentBlob] = useState(null)

  useEffect(() => {
    fetch(testImageURL)
      .then((response) => response.blob())
      .then((data) => {
        setCurrentBlob(data)

        const newImage = {
          id: crypto.randomUUID(),
          blob: data
        }

        addImage(newImage)
          .then((message) => console.log(message))
          .catch((message) => console.error(message))

        updateAttributes({ src: newImage.id })
      })
      .catch((message) => console.error(message))
  }, [])

  function handleRegenerateImage() {
    setCurrentBlob(null)
    console.log("Regenerate", node.attrs.alt)
    fetch(testImageURL)
      .then((response) => response.blob())
      .then((data) => {
        setCurrentBlob(data)

        const newImage = {
          id: crypto.randomUUID(),
          blob: data
        }

        addImage(newImage)
          .then((message) => console.log(message))
          .catch((message) => console.error(message))

        updateAttributes({ src: newImage.id })
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
  addNodeView() {
    return ReactNodeViewRenderer(DiaryImageView)
  },
})

export default DiaryImage

import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react'

import { useState } from 'react'
import Image from '@tiptap/extension-image'
import { FiTrash2, FiRefreshCw } from 'react-icons/fi'
import loadingImageSrc from '../../assets/tiptap-writing-space/dear-diary-generating.gif'

function DiaryImageView({ node, deleteNode }) {
  const [isDeleting, setIsDeleting] = useState(false)

  function regenerateImage() {
    const originalPrompt = node.attrs.alt
    console.log('Regenerate using:', originalPrompt)
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
      <img className="diary-illustration" src={node.attrs.src} alt={node.attrs.alt || ''} />

      <div className="diary-image-actions">
        <button
          className="diary-image-action-button"
          title="Regenerate image"
          disabled={node.attrs.src === loadingImageSrc}
          type="button"
          onClick={regenerateImage}
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

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import DiaryImage from './ImageDiary'
import { BubbleMenu } from '@tiptap/react/menus'
import { FaWandMagicSparkles  } from "react-icons/fa6"
import { 
  GrBold, 
  GrItalic, 
  GrUnderline,
  GrUnorderedList, 
  GrTextAlignRight, 
  GrTextAlignLeft, 
  GrTextAlignCenter,
  GrUndo,
  GrRedo 
} from 'react-icons/gr'
import './Tiptap.css'
import loadingImageSrc from "../../assets/tiptap-writing-space/dear-diary-generating.gif"

function getButtonClass(isActive) {
  if (isActive) {
    return 'toolbar-button active-toolbar-button'
  }

  return 'toolbar-button'
}

function MenuBar({ editor }) {
  if (editor == null) {
    return null
  }

  return (
    <div className="editor-toolbar">
      <div className="toolbar-button-group">
        <button
          className={getButtonClass(editor.isActive('bold'))}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
          type="button"
        >
          <GrBold />
        </button>
        <button
          className={getButtonClass(editor.isActive('italic'))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
          type="button"
        >
          <GrItalic />
        </button>
        <button
          className={getButtonClass(editor.isActive('underline'))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
          type="button"
        >
          <GrUnderline />
        </button>
      </div>

      <div className="toolbar-button-group">
        <button
          className={getButtonClass(editor.isActive('bulletList'))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullets"
          type="button"
        >
          <GrUnorderedList />
        </button>
      </div>

      <div className="toolbar-button-group">
        <button
          className={getButtonClass(editor.isActive({ textAlign: 'left' }))}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align left"
          type="button"
        >
          <GrTextAlignLeft />
        </button>

        <button
          className={getButtonClass(editor.isActive({ textAlign: 'center' }))}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align center"
          type="button"
        >
          <GrTextAlignCenter />
        </button>

        <button
          className={getButtonClass(editor.isActive({ textAlign: 'right' }))}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align right"
          type="button"
        >
          <GrTextAlignRight />
        </button>
      </div>

      <div className="toolbar-button-group">
        <button
          className="toolbar-button"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
          type="button"
        >
          <GrUndo />
        </button>

        <button
          className="toolbar-button"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          type="button"
        >
          <GrRedo />
        </button>
      </div>
    </div>
  )
}

const illustrateMenuOptions = { placement: 'top', offset: 8 }

function handleIllustrate(editor) {
  const { from, to } = editor.state.selection
  const selectedText = editor.state.doc.textBetween(from, to, ' ')
  console.log('Illustrate this:', selectedText)
  editor.chain().focus().setTextSelection(to).setImage({src: loadingImageSrc, alt: selectedText}).run()
}

function shouldShow({editor, from, to}){
  const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
  return from !== to && selectedText.length > 0
}

function Tiptap({entry}) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      DiaryImage
    ],
    content: entry.content,
    editorProps: {
      attributes: {
        class: 'diary-writing-paper',
      },
    },
    onUpdate: ({ editor }) => {
      const diaryContent = editor.getJSON()
      console.log(diaryContent)
    },
  })

  if(entry == null)
    return null

  return (
    <div className="tiptap-editor">
      <MenuBar editor={editor} />
      <BubbleMenu
        className="tiptap-illustrate-menu"
        editor={editor}
        options={illustrateMenuOptions}
        shouldShow={shouldShow}
      >
        <button
          className="illustrate-selection-button"
          onClick={() => handleIllustrate(editor)}
          type="button"
        >
          <FaWandMagicSparkles className="wand"/>
          Illustrate
        </button>
      </BubbleMenu>
      <EditorContent className="tiptap-writing-area" editor={editor} />
    </div>
  )
}

export default Tiptap

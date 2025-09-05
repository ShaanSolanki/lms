'use client'

import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Image,

    // Separator
} from 'lucide-react'

interface MenubarProps {
    editor: Editor
}

export const Menubar = ({ editor }: MenubarProps) => {
    const addImage = () => {
        const url = window.prompt('Enter image URL:')
        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL:', previousUrl)

        if (url === null) {
            return
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }



    return (
        <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1">
            {/* Text Formatting */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''
                    }`}
                title="Bold"
            >
                <Bold size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''
                    }`}
                title="Italic"
            >
                <Italic size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''
                    }`}
                title="Underline"
            >
                <UnderlineIcon size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''
                    }`}
                title="Strikethrough"
            >
                <Strikethrough size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200' : ''
                    }`}
                title="Code"
            >
                <Code size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
                    }`}
                title="Heading 1"
            >
                <Heading1 size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
                    }`}
                title="Heading 2"
            >
                <Heading2 size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
                    }`}
                title="Heading 3"
            >
                <Heading3 size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''
                    }`}
                title="Bullet List"
            >
                <List size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''
                    }`}
                title="Numbered List"
            >
                <ListOrdered size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''
                    }`}
                title="Quote"
            >
                <Quote size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Alignment */}
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''
                    }`}
                title="Align Left"
            >
                <AlignLeft size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''
                    }`}
                title="Align Center"
            >
                <AlignCenter size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''
                    }`}
                title="Align Right"
            >
                <AlignRight size={16} />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Media & Links */}
            <button
                onClick={setLink}
                className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''
                    }`}
                title="Add Link"
            >
                <Link size={16} />
            </button>

            <button
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-100"
                title="Add Image"
            >
                <Image size={16} />
            </button>



            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Undo/Redo */}
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Undo"
            >
                <Undo size={16} />
            </button>

            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Redo"
            >
                <Redo size={16} />
            </button>
        </div>
    )
}
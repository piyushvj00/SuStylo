
import React, { useCallback, useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Color from "@tiptap/extension-color";
import Youtube from "@tiptap/extension-youtube";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";

const Tiptap = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      Highlight,
      Color,
      Youtube.configure({
        width: 640,
        height: 360,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  // Set content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // IMAGE UPLOAD HANDLER
  const addImage = useCallback(() => {
    const url = window.prompt("Paste image URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  // YOUTUBE VIDEO HANDLER
  const addYoutube = useCallback(() => {
    const url = window.prompt("Paste YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  }, [editor]);

  // Prevent form submission when pressing Enter in toolbar
  const handleToolbarClick = (callback) => (e) => {
    e.preventDefault();
    callback();
  };

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg min-h-[300px] p-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b bg-gray-50 rounded-t-lg">
        {/* Text Formatting */}
        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleBold().run())}
          className={`toolbar-btn ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <strong>B</strong>
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleItalic().run())}
          className={`toolbar-btn ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <em>I</em>
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleUnderline().run())}
          className={`toolbar-btn ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        >
          <u>U</u>
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleStrike().run())}
          className={`toolbar-btn ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        >
          <s>S</s>
        </button>

        {/* Headings */}
        {/* {[1,2,3].map(level => (
          <button 
            key={level}
            onClick={handleToolbarClick(() => editor.chain().focus().toggleHeading({ level }).run())}
            className={`toolbar-btn ${editor.isActive('heading', { level }) ? 'bg-gray-200' : ''}`}
          >
            H{level}
          </button>
        ))} */}

        {/* Lists */}
        {/* <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleBulletList().run())}
          className={`toolbar-btn ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          • List
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleOrderedList().run())}
          className={`toolbar-btn ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        >
          1. List
        </button> */}

        {/* Blockquote */}
        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().toggleBlockquote().run())}
          className={`toolbar-btn ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        >
          ❝
        </button>

        {/* Alignment */}
        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().setTextAlign("left").run())}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        >
          ⬅
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().setTextAlign("center").run())}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        >
          ⬜
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().setTextAlign("right").run())}
          className={`toolbar-btn ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        >
          ➡
        </button>

        {/* Color */}
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          className="w-8 h-8 p-1 border rounded cursor-pointer"
          title="Text Color"
        />

        {/* Media */}
        <button 
          onClick={handleToolbarClick(addImage)} 
          className="toolbar-btn"
        >
          🖼
        </button>

        <button 
          onClick={handleToolbarClick(addYoutube)} 
          className="toolbar-btn"
        >
          ▶
        </button>

        {/* Table */}
        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
          className="toolbar-btn"
        >
          Table
        </button>

        {/* Undo/Redo */}
        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().undo().run())}
          className="toolbar-btn"
          disabled={!editor.can().undo()}
        >
          ↺
        </button>

        <button 
          onClick={handleToolbarClick(() => editor.chain().focus().redo().run())}
          className="toolbar-btn"
          disabled={!editor.can().redo()}
        >
          ↻
        </button>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px]">
        <EditorContent 
          editor={editor} 
          className="min-h-[300px] p-4 prose max-w-none"
        />
      </div>
    </div>
  );
};

// Add CSS for toolbar buttons
const toolbarStyles = `
  .toolbar-btn {
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }
  .toolbar-btn:hover {
    background: #f3f4f6;
  }
  .toolbar-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .ProseMirror {
    min-height: 300px;
    outline: none;
  }
  .ProseMirror p.is-editor-empty:first-child::before {
    color: #9ca3af;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = toolbarStyles;
document.head.appendChild(styleSheet);

export default Tiptap;
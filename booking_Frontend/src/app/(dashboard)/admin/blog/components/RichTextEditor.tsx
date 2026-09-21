// components/RichTextEditor.tsx
"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import Image from "@tiptap/extension-image";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-bold ${editor.isActive("bold") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm italic ${editor.isActive("italic") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-sm line-through ${editor.isActive("strike") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          S
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        {[1, 2, 3].map((level) => (
          <button
            key={level}
            type="button"
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run()
            }
            className={`px-2 py-1 rounded text-sm font-semibold ${editor.isActive("heading", { level }) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
          >
            H{level}
          </button>
        ))}
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("bulletList") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("orderedList") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded text-sm ${editor.isActive("blockquote") ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200"}`}
        >
          " Quote
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded text-sm hover:bg-gray-200"
        >
          ↩ Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded text-sm hover:bg-gray-200"
        >
          ↪ Redo
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
};

export default RichTextEditor;

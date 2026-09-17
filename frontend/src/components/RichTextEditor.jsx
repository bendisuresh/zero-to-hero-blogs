import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

function RichTextEditor({
    value = "",
    onChange,
    onEditorReady,
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    useEffect(() => {
        if (!editor) {
            return;
        }

        const nextContent = value || "";
        const currentContent = editor.getHTML();

        if (currentContent === nextContent) {
            return;
        }

        editor.commands.setContent(
            nextContent,
            false
        );
    }, [editor, value]);

    return (
        <EditorContent
            editor={editor}
            className="rich-text-editor"
        />
    );
}

export default RichTextEditor;
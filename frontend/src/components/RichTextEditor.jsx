import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

function RichTextEditor({
    value = "",
    onChange,
    onEditorReady,
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Image,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    /*
     * Expose the Tiptap editor instance to the parent page.
     */
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    /*
     * Synchronize external content with Tiptap.
     *
     * The comparison prevents the editor from being reset
     * every time the parent form state changes.
     *
     * The second argument `false` prevents this external
     * update from triggering Tiptap's onUpdate callback.
     */
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
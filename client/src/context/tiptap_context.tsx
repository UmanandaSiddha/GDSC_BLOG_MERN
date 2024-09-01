import React, { createContext, useState } from 'react';
import { common, createLowlight } from 'lowlight';
import { useEditor } from '@tiptap/react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import ListItem from '@tiptap/extension-list-item';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Link from '@tiptap/extension-link';
// import FileHandler from '@tiptap-pro/extension-file-handler';

type TiptapContextProviderProps = {
    children: React.ReactNode;
};

type TiptapContextType = {
    editor: any;
    content: string;
    setContent: (content: string) => void;
    editorText: string;
    setEditorText: (editorText: string) => void;
    htmlContent: string;
    setHtmlContent: (htmlContent: string) => void;
};

const TiptapContext = createContext<TiptapContextType>({
    editor: null,
    content: '',
    setContent: () => { },
    editorText: '',
    setEditorText: () => { },
    htmlContent: '',
    setHtmlContent: () => { },
});

function TiptapProvider({ children }: TiptapContextProviderProps) {
    const [content, setContent] = useState<string>('');
    const [editorText, setEditorText] = useState<string>('');
    const [htmlContent, setHtmlContent] = useState<string>('');

    const lowlight = createLowlight(common);

    const editor = useEditor({
        extensions: [
            Color.configure({ types: [TextStyle.name, ListItem.name] }),
            TextStyle.configure({ types: [ListItem.name] } as any),
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph', 'image'],
            }),
            // FileHandler.configure({
            //     allowedMimeTypes: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp'],
            //     onDrop: (currentEditor, files, pos) => {
            //         files.forEach(file => {
            //             const fileReader = new FileReader()

            //             fileReader.readAsDataURL(file)
            //             fileReader.onload = () => {
            //                 currentEditor.chain().insertContentAt(pos, {
            //                     type: 'image',
            //                     attrs: {
            //                         src: fileReader.result,
            //                     },
            //                 }).focus().run()
            //             }
            //         })
            //     },
            //     onPaste: (currentEditor, files, htmlContent) => {
            //         files.forEach(file => {
            //             if (htmlContent) {
            //                 console.log(htmlContent)
            //                 return false
            //             }

            //             const fileReader = new FileReader()

            //             fileReader.readAsDataURL(file)
            //             fileReader.onload = () => {
            //                 currentEditor.chain().insertContentAt(currentEditor.state.selection.anchor, {
            //                     type: 'image',
            //                     attrs: {
            //                         src: fileReader.result,
            //                     },
            //                 }).focus().run()
            //             }
            //         })
            //     },
            // }),
            Underline.configure({
                HTMLAttributes: {
                    class: 'my-custom-class',
                },
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Highlight,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Superscript,
            Subscript,
            Link.configure({
                openOnClick: false,
                autolink: true,
            }),
        ],
        editorProps: {
            attributes: {
                class: 'm-2 focus:outline-none',
            },
        },
        content,
        immediatelyRender: false,
    });

    return (
        <TiptapContext.Provider
            value={{
                editor,
                content,
                setContent,
                editorText,
                setEditorText,
                htmlContent,
                setHtmlContent,
            }}
        >
            {children}
        </TiptapContext.Provider>
    );
}

export { TiptapProvider, TiptapContext };
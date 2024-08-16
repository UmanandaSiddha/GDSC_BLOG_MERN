import '@/styles/styles.scss';
import { EditorContent } from '@tiptap/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Icons } from './icons';
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from '@/components/ui/menubar';
import { TiptapContext } from '@/context/tiptap_context';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const TableMenu = ({ editor }: any) => [
    {
        id: 1,
        name: 'Insert Table',
        action: () =>
            editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
    },
    {
        id: 2,
        name: 'Add Column Before',
        action: () => editor.chain().focus().addColumnBefore().run(),
    },
    {
        id: 3,
        name: 'Add Column After',
        action: () => editor.chain().focus().addColumnAfter().run(),
    },
    {
        id: 4,
        name: 'Delete Column',
        action: () => editor.chain().focus().deleteColumn().run(),
    },
    {
        id: 5,
        name: 'Add Row Before',
        action: () => editor.chain().focus().addRowBefore().run(),
    },
    {
        id: 6,
        name: 'Add Row After',
        action: () => editor.chain().focus().addRowAfter().run(),
    },
    {
        id: 7,
        name: 'Delete Row',
        action: () => editor.chain().focus().deleteRow().run(),
    },
    {
        id: 8,
        name: 'Delete Table',
        action: () => editor.chain().focus().deleteTable().run(),
    },
    {
        id: 9,
        name: 'Merge Cells',
        action: () => editor.chain().focus().mergeCells().run(),
    },
    {
        id: 11,
        name: 'Toggle Header Column',
        action: () => editor.chain().focus().toggleHeaderColumn().run(),
    },
    {
        id: 12,
        name: 'Toggle Header Row',
        action: () => editor.chain().focus().toggleHeaderRow().run(),
    },
    {
        id: 13,
        name: 'Toggle Header Cell',
        action: () => editor.chain().focus().toggleHeaderCell().run(),
    },
    {
        id: 14,
        name: 'Merge Or Split',
        action: () => editor.chain().focus().mergeOrSplit().run(),
    },
    {
        id: 15,
        name: 'Set Cell Attribute',
        action: () => editor.chain().focus().setCellAttribute('colspan', 2).run(),
    },
];

const MenuBarIcon = ({ editor }: any) => [
    {
        id: 1,
        name: 'bold',
        icon: Icons.bold,
        onClick: () => editor.chain().focus().toggleBold().run(),
        disable: !editor.can().chain().focus().toggleBold().run(),
        isActive: editor.isActive('bold') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 2,
        name: 'italic',
        icon: Icons.italic,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        disable: !editor.can().chain().focus().toggleItalic().run(),
        isActive: editor.isActive('italic') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 21,
        name: 'underline',
        icon: Icons.underline,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        disable: false,
        isActive: editor.isActive('underline') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 3,
        name: 'strike',
        icon: Icons.strikethrough,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        disable: !editor.can().chain().focus().toggleStrike().run(),
        isActive: editor.isActive('strike') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 4,
        name: 'code',
        icon: Icons.code,
        onClick: () => editor.chain().focus().toggleCode().run(),
        disable: !editor.can().chain().focus().toggleCode().run(),
        isActive: editor.isActive('code') ? 'is-active text-green-700' : '',
        hover: false,
        split: true,
    },
    {
        id: 5,
        name: 'heading1',
        icon: Icons.h1,
        onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        disable: false,
        isActive: editor.isActive('heading', { level: 1 })
            ? 'is-active text-green-700'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 6,
        name: 'heading2',
        icon: Icons.h2,
        onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        disable: false,
        isActive: editor.isActive('heading', { level: 2 })
            ? 'is-active text-green-700'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 13,
        name: 'heading3',
        icon: Icons.h3,
        onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        disable: false,
        isActive: editor.isActive('heading', { level: 3 })
            ? 'is-active text-green-700'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 14,
        name: 'heading4',
        icon: Icons.h4,
        onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
        disable: false,
        isActive: editor.isActive('heading', { level: 4 })
            ? 'is-active text-green-700'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 15,
        name: 'heading5',
        icon: Icons.h5,
        onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
        disable: false,
        isActive: editor.isActive('heading', { level: 5 })
            ? 'is-active text-green-700'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 7,
        name: 'paragraph',
        icon: Icons.paragraph,
        onClick: () => editor.chain().focus().setParagraph().run(),
        disable: false,
        isActive: editor.isActive('paragraph') ? 'is-active text-green-700' : '',
        hover: false,
        split: true,
    },
    {
        id: 8,
        name: 'bullet list',
        icon: Icons.ul,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        disable: false,
        isActive: editor.isActive('bulletList')
            ? 'is-active text-green-700 list-disc'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 9,
        name: 'ordered list',
        icon: Icons.ol,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        disable: false,
        isActive: editor.isActive('orderedList')
            ? 'is-active text-green-700 list-decimal'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 16,
        name: 'align left',
        icon: Icons.alignLeft,
        onClick: () => editor.chain().focus().setTextAlign('left').run(),
        disable: false,
        isActive: editor.isActive({ textAlign: 'left' }) ? 'is-active' : '',
        hover: false,
        split: false,
    },
    {
        id: 17,
        name: 'align center',
        icon: Icons.alignCenter,
        onClick: () => editor.chain().focus().setTextAlign('center').run(),
        disable: false,
        isActive: editor.isActive({ textAlign: 'center' })
            ? 'is-active text-green-700 text-center'
            : '',
        hover: false,
        split: false,
    },
    {
        id: 18,
        name: 'align right',
        icon: Icons.alignRight,
        onClick: () => editor.chain().focus().setTextAlign('right').run(),
        disable: false,
        isActive: editor.isActive({ textAlign: 'right' }) ? 'is-active' : '',
        hover: false,
        split: false,
    },
    {
        id: 19,
        name: 'align justify',
        icon: Icons.alignJustify,
        onClick: () => editor.chain().focus().setTextAlign('justify').run(),
        disable: false,
        isActive: editor.isActive({ textAlign: 'justify' }) ? 'is-active' : '',
        hover: false,
        split: true,
    },
    {
        id: 20,
        name: 'highlight',
        icon: Icons.bg,
        onClick: () => editor.chain().focus().toggleHighlight().run(),
        disable: false,
        isActive: editor.isActive('highlight') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 10,
        name: 'code block',
        icon: Icons.codeblock,
        onClick: () => editor.chain().focus().toggleCodeBlock().run(),
        disable: false,
        isActive: editor.isActive('codeBlock') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 11,
        name: 'blockquote',
        icon: Icons.blockquote,
        onClick: () => editor.chain().focus().toggleBlockquote().run(),
        disable: false,
        isActive: editor.isActive('blockquote') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 12,
        name: 'table',
        icon: Icons.table,
        onClick: () =>
            editor
                .chain()
                .focus()
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run(),
        disable: false,
        isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
        hover: true,
        split: true,
    },
    {
        id: 13,
        name: 'subscript',
        icon: Icons.subscript,
        onClick: () =>
            editor
                .chain()
                .focus()
                .toggleSubscript()
                .run(),
        disable: false,
        isActive: editor.isActive('subscript') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 14,
        name: 'superscript',
        icon: Icons.superscript,
        onClick: () =>
            editor
                .chain()
                .focus()
                .toggleSuperscript()
                .run(),
        disable: false,
        isActive: editor.isActive('superscript') ? 'is-active text-green-700' : '',
        hover: false,
        split: true,
    },
    {
        id: 15,
        name: 'link',
        icon: Icons.link,
        onClick: () => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)
            if (url === null) {
                return
            }
            if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink()
                    .run()

                return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url })
                .run()
        },
        disable: false,
        isActive: editor.isActive('link') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 16,
        name: 'unlink',
        icon: Icons.unlink,
        onClick: () =>
            editor
                .chain()
                .focus()
                .unsetLink()
                .run(),
        disable: !editor.isActive('link'),
        isActive: editor.isActive('unlink') ? 'is-active text-green-700' : '',
        hover: false,
        split: true,
    },
    {
        id: 30,
        name: 'undo',
        icon: Icons.undo,
        onClick: () => editor.chain().focus().undo().run(),
        disable: !editor.can().undo(),
        isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
        hover: false,
        split: false,
    },
    {
        id: 31,
        name: 'redo',
        icon: Icons.redo,
        onClick: () => editor.chain().focus().redo().run(),
        disable: !editor.can().redo(),
        isActive: editor.isActive('table') ? 'is-active text-green-700' : '',
        hover: false,
        split: true,
    },
];

const MenuBar = ({ setImageURL }: any) => {

    const { editor } = useContext(TiptapContext);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [uploadLoading, setUploadLoading] = useState(false);

    if (!editor) {
        return null;
    }

    const MenuBarIconValue = MenuBarIcon({ editor });

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         if (typeof reader.result === 'string') {
        //             setImageURL(reader.result);
        //         }
        //     };
        //     reader.readAsDataURL(file);
        // }

        if (!file) return;
        
        setUploadLoading(true);
        const formData = new FormData();
        formData.append('blogs', file);

        try {
            const id = searchParams.get("id");
            const link = id ? `${import.meta.env.VITE_BASE_URL}/blog/upload/blog?id=${id}` : `${import.meta.env.VITE_BASE_URL}/blog/upload/blog`
            const { data } = await axios.post(link, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
            setSearchParams({ type: 'edit', id: data.data.blogId }, { replace: true });
            if (data) {
                setImageURL(data.data.file);
            }
            toast.success('File uploaded successfully');
        } catch (error: any) {
            setUploadLoading(false);
            toast.error(error.response.data.message);
        }
        setUploadLoading(false);
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-wrap justify-center items-center gap-1 bg-black p-2 text-white w-full">
            <input
                type="color"
                onInput={(event: any) =>
                    editor.chain().focus().setColor(event.target.value).run()
                }
                value={editor.getAttributes('textStyle').color}
            />
            {MenuBarIconValue.map((item, index) => (
                <div key={index}>
                    {item.hover ? (
                        <Menubar className="bg-transparent border-none">
                            <MenubarMenu>
                                <MenubarTrigger disabled={item.disable} className={`mr-1 p-0 ${item.disable ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                    <item.icon />
                                </MenubarTrigger>
                                {item.split && (
                                    <div className="mx-1 w-[1px] flex bg-gray-500 h-6" />
                                )}
                                <MenubarContent>
                                    {TableMenu({ editor }).map((menuItem) => (
                                        <MenubarItem key={menuItem.id} onClick={menuItem.action}>
                                            {menuItem.name}
                                        </MenubarItem>
                                    ))}
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    ) : (
                        <div className="flex items-center h-full gap-1">
                            <button
                                onClick={item.onClick}
                                disabled={item.disable}
                                className={`${item.disable
                                    ? 'cursor-not-allowed p-1'
                                    : 'cursor-pointer hover:bg-gray-500 hover:rounded-lg p-1'
                                    } + ${item.isActive ? item.isActive : ''}`}
                            >
                                <item.icon />
                            </button>
                            {item.split && (
                                <div className="mx-1 w-[1px] flex bg-gray-500 h-6" />
                            )}
                        </div>
                    )}
                </div>
            ))}
            <div className="cursor-pointer hover:bg-gray-500 hover:rounded-lg p-1">
                <input
                    type="file"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    className="hidden"
                />
                <Icons.image onClick={handleIconClick} />
            </div>
        </div>
    )
}

const Tiptap = ({ isEditable }: { isEditable: boolean }) => {

    const { editor, content, editorText } = useContext(TiptapContext);
    const [imageURL, setImageURL] = useState<string | null>(null);

    useEffect(() => {
        if (editor && imageURL) {
            editor.commands.setImage({
                src: imageURL,
            });
            // editor.chain().focus().setImage({ src: imageURL }).run();
        }
    }, [imageURL]);

    useEffect(() => {
        if (editor && editorText) {
            editor
                .chain()
                .focus()
                .insertContent(editorText)
                .insertContent(`<br />`)
                .run();
        }
    }, [editorText, editor]);

    useEffect(() => {
        editor?.chain().focus().insertContent(content).run();
    }, [content, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable);
        }
    }, [editor, isEditable]);

    // const hanldeCopy = () => {
    //     const html = editor.getHTML();
    //     console.log(html)
    //     navigator.clipboard.writeText(html);
    // }

    // const addImage = useCallback(() => {
    //     const url = window.prompt('URL')

    //     if (url) {
    //         editor.chain().focus().setImage({ src: url }).run()
    //     }
    // }, [editor]);

    return (
        <div className='w-full'>
            <MenuBar editor={editor} setImageURL={setImageURL} />
            <EditorContent
                className="w-full p-3 max-h-[500px] min-h-[300px] hide-scrollbar overflow-auto"
                editor={editor}
            />
        </div>
    )
}

export default Tiptap;

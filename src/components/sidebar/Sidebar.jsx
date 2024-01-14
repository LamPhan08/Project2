import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import { SidebarData } from './sidebarData';
import ArticleIcon from '@mui/icons-material/Article';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { NavLink, useNavigate } from 'react-router-dom';
import { database, storage } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useSelector } from 'react-redux'
import { ROOT_FOLDER } from '../../hooks/useFolder';
import { v4 as uuidV4 } from 'uuid'
import { Toast, ProgressBar } from 'react-bootstrap'
import mammoth from 'mammoth';
import { Document, Packer, Paragraph, TextRun } from "docx";

const menuItem = [
    {
        title: "New Doc File",
        icon: ArticleIcon,
    },
    {
        title: "New Folder",
        icon: CreateNewFolderIcon
    },
    {
        title: "Upload File",
        icon: UploadFileIcon
    },
    // {
    //     title: "Upload Folder",
    //     icon: DriveFolderUploadIcon
    // },
]

const Sidebar = () => {
    //State
    const [openMenu, setOpenMenu] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState([])
    const [nameFolder, setNameFolder] = useState(false)
    const [nameFile, setNameFile] = useState(false)
    const [showExistingName, setShowExistingName] = useState(false)
    const [name, setName] = useState('')
    const [loadingCursor, setLoadingCursor] = useState(false)
    const { currentUser } = useAuth()


    const { currentFolderId, currentFolder } = useSelector(state => state.currentFolder)

    const navigate = useNavigate()

    // console.log('currentFolder:', currentFolder)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    const handleNameFolder = () => {
        setNameFolder(true)
        setOpenMenu(!openMenu)
    }

    const handleNameFile = () => {
        setNameFile(true)
        setOpenMenu(!openMenu)
    }

    const handleUpload = (e) => {
        const file = e.target.files[0]


        if (currentFolder === null || file === null || file === undefined) {
            return
        }

        // if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        //     const reader = new FileReader();

        //     reader.onload = (event) => {
        //         const content = event.target.result;

        //         console.log('content:', content)

        //         mammoth.convertToHtml({ arrayBuffer: content })
        //             .then((result) => {
        //                 // console.log(result.value)
                        
        //             })
        //             .catch((error) => {
        //                 console.error('Error extracting text from DOCX:', error);
        //             });
        //     };

        //     reader.readAsArrayBuffer(file, 'UTF-8');
        // }

        const id = uuidV4()

        setUploadingFiles(prevUploadingFiles => [
            ...prevUploadingFiles,
            { id: id, name: file.name, progress: 0, error: false }
        ])

        const filePath = currentFolder === ROOT_FOLDER
            ? `${currentFolder.path.join("/")}/${file.name}`
            : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

        const uploadTask = storage
            .ref(`/files/${currentUser.uid}/${filePath}`)
            .put(file)


        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = snapshot.bytesTransferred / snapshot.totalBytes
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                        if (uploadFile.id === id) {
                            return { ...uploadFile, progress: progress }
                        }

                        return uploadFile
                    })
                })
            },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadFile => {
                        if (uploadFile.id === id) {
                            return { ...uploadFile, error: true }
                        }
                        return uploadFile
                    })
                })
            },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadFile => {
                        return uploadFile.id !== id
                    })
                })

                uploadTask.snapshot.ref.getDownloadURL().then(url => {
                    database.files
                        .where("name", "==", file.name)
                        .where("userId", "==", currentUser.uid)
                        .where("folderId", "==", currentFolder.id)
                        .get()
                        .then(existingFiles => {
                            const existingFile = existingFiles.docs[0]
                            if (existingFile) {
                                existingFile.ref.update({ url: url, upload: true })
                            } else {
                                database.files.add({
                                    url: url,
                                    name: file.name,
                                    type: file.type,
                                    createdAt: database.getCurrentTimestamp(),
                                    modifiedDate: database.getCurrentTimestamp(),
                                    folderId: currentFolder.id,
                                    userId: currentUser.uid,
                                    upload: true
                                })
                            }
                        })
                })
            }
        )

        setOpenMenu(!openMenu)
    }

    const handleCreateFolder = () => {
        if (currentFolder === null) {
            return
        }//


        const path = [...currentFolder.path]

        if (currentFolder !== ROOT_FOLDER) {
            path.push({ name: currentFolder.name, id: currentFolder.id })
        }

        database.folders.add({
            name: name,
            parentId: currentFolderId === undefined ? null : currentFolderId,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimestamp()
        })
    }

    const handleCreateDocFile = async () => {
        if (currentFolder === null) {
            return
        }

        setLoadingCursor(true)

        const content = ""

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun(content),
                            ],
                        }),
                    ],
                },
            ],
        });

        const data = await Packer.toBlob(doc)

        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, );

        const file = new File([blob], `${name}.docx`, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }, )

        const filePath = currentFolder === ROOT_FOLDER
            ? `${currentFolder.path.join("/")}/${file.name}`
            : `${currentFolder.path.join("/")}/${currentFolder.name}/${file.name}`

        const uploadTask = storage
            .ref(`/files/${currentUser.uid}/${filePath}`)
            .put(file)


        uploadTask.on(
            "state_changed",
            () => {

            },
            () => {

            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(url => {
                    database.files
                        .where("name", "==", name)
                        .where("userId", "==", currentUser.uid)
                        .where("folderId", "==", currentFolder.id)
                        .get()
                        .then(existingFiles => {
                            const existingFile = existingFiles.docs[0]
                            console.log('existingFiles:', existingFiles)
                            if (existingFile) {
                                setShowExistingName(true)
                            
                            } else {
                                const newFileRef = database.files.doc();
                                const newFileId = newFileRef.id

                                newFileRef.set({
                                    url: url,
                                    name: name,
                                    type: file.type,
                                    createdAt: database.getCurrentTimestamp(),
                                    modifiedDate: database.getCurrentTimestamp(),
                                    folderId: currentFolder.id,
                                    userId: currentUser.uid,
                                    upload: false
                                })

                                navigate('text-editor', {state: {
                                    id: newFileId,
                                    url: url,
                                    name: name,
                                    type: file.type,
                                    createdAt: database.getCurrentTimestamp(),
                                    modifiedDate: database.getCurrentTimestamp(),
                                    folderId: currentFolder.id,
                                    userId: currentUser.uid,
                                    upload: false
                                }})

                                setShowExistingName(false)
                                setName('')
                                setLoadingCursor(false)
                                setNameFile(false)
                            }
                        })
                })
            }
        )

    }

    return (
        <div className='sidebar_container'>
            <div className="newBtnContainer" onClick={handleOpenMenu}>
                <AddIcon />

                <span>New</span>
            </div>

            <div className={`new_dropdown_menu ${openMenu ? 'active' : 'inactive'}`}>
                {menuItem.map((item, index) => {
                    return (
                        <div onClick={item.title === 'New Folder' ? handleNameFolder : (item.title === 'New Doc File' ? handleNameFile : null)} key={index}>

                            {item.title === 'Upload File'
                                ? <div className='menu_item' >
                                    <item.icon />
                                    <label className='chooseFileBtn' htmlFor='file' style={{ cursor: 'pointer' }}>{item.title}</label>
                                    <input type="file" id="file" style={{ display: "none" }} onChange={handleUpload} />
                                </div>
                                : <div className='menu_item' >
                                    <item.icon />
                                    {item.title}
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className='sidebar_item_container'>
                {SidebarData.map((item, index) => {
                    return (
                        <NavLink key={index} className={navClass => navClass.isActive ? 'active_sidebar_item' : 'inactive_sidebar_item'} to={item.path}>
                            <item.icon />
                            {item.title}
                        </NavLink>
                    )
                })}
            </div>

            {nameFolder &&
                <div className='nameFolderPopup'>
                    {/* <span onClick={() => {setNameFolder(false)}}>&times;</span> */}

                    <div className="nameFolderForm">
                        <div className='newFolderText'>New Folder</div>

                        <div className='input_container' style={{marginBottom: 60}}>
                            <input type='text' className='input' placeholder='Type new name...' onChange={e => setName(e.target.value)} />
                        </div>

                        <div className='newFolderBtnZone'>
                            <button className='nameFolderBtn' onClick={() => {
                                setName('')
                                setNameFolder(false)
                            }}>Cancel
                            </button>

                            <button className='nameFolderBtn' onClick={() => {
                                handleCreateFolder()
                                setName('')
                                setNameFolder(false)
                            }}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            }

            {nameFile &&
                <div className={`nameFolderPopup ${loadingCursor ? 'loadingCursor' : ''}`}>
                    {/* <span onClick={() => {setNameFolder(false)}}>&times;</span> */}

                    <div className="nameFolderForm">
                        <div className='newFolderText'>New Doc File</div>

                        <div className='input_container'>
                            <input type='text' className='input' placeholder='Type new name...' onChange={e => setName(e.target.value)} />
                        </div>

                        <div className='fileNameExists'>{showExistingName ? "File name already exists!" : " "}</div>
                        {/* {showExistingName && <div className='fileNameExists'>File name already exists!</div>} */}

                        <div className='newFolderBtnZone'>
                            <button className='nameFolderBtn' onClick={() => {
                                setName('')
                                setNameFile(false)
                            }}>Cancel
                            </button>

                            <button className='nameFolderBtn' onClick={() => {
                                handleCreateDocFile()
                            }}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            }

            {uploadingFiles.length > 0 &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            maxWidth: "250px",
                        }}
                    >
                        {uploadingFiles.map(file => (
                            <Toast
                                key={file.id}
                                onClose={() => {
                                    setUploadingFiles(prevUploadingFiles => {
                                        return prevUploadingFiles.filter(uploadFile => {
                                            return uploadFile.id !== file.id
                                        })
                                    })
                                }}
                            >
                                <Toast.Header
                                    closeButton={file.error}
                                    className="text-truncate w-100 d-block"
                                >
                                    {file.name}
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        animated={!file.error}
                                        variant={file.error ? "danger" : "primary"}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={
                                            file.error
                                                ? "Error"
                                                : `${Math.round(file.progress * 100)}%`
                                        }
                                    />
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>,
                    document.body
                )}
        </div>
    )
}

export default Sidebar

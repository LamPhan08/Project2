import React, { useState } from 'react'
import './sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import { SidebarData } from './sidebarData';
import ArticleIcon from '@mui/icons-material/Article';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { NavLink } from 'react-router-dom';
import { database } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import {useSelector} from 'react-redux'
import { ROOT_FOLDER } from '../../hooks/useFolder';

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
    {
        title: "Upload Folder",
        icon: DriveFolderUploadIcon
    },
]

const Sidebar = () => {
    //State
    const [openMenu, setOpenMenu] = useState(false)
    const [nameFolder, setNameFolder] = useState(false)
    const [name, setName] = useState('')
    const {currentUser} = useAuth()

    const {currentFolderId, currentFolder} = useSelector(state => state.currentFolder)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    const handleNameFolder = () => {
        setNameFolder(true)
        setOpenMenu(!openMenu)
    }

    const handleUploadFile = () => {
        console.log('click')
    }

    const handleCreateFolder = () => {
        if (currentFolderId === null) {
            return
        }//

        const path = [...currentFolder.path]

        if (currentFolder !== ROOT_FOLDER) {
            path.push({name: currentFolder.name, id: currentFolder.id})
        }

        database.folders.add({
            name: name,
            parentId: currentFolderId === undefined ? null : currentFolderId,
            userId: currentUser.uid,
            path: path,
            createdAt: database.getCurrentTimestamp()
        })
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
                        <div className='menu_item' onClick={item.title === 'New Folder' ? handleNameFolder : (item.title === 'Upload File' ? handleUploadFile : null)} key={index}>
                            <item.icon />
                            {item.title}
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
                <div className="nameFolderPopup">
                    {/* <span onClick={() => {setNameFolder(false)}}>&times;</span> */}

                    <div className="nameFolderForm">
                        <div className='newFolderText'>New Folder</div>

                        <div className='input_container'>
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
        </div>
    )
}

export default Sidebar

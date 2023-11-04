import React, {useState} from 'react'
import './sidebar.css'
import AddIcon from '@mui/icons-material/Add';
import { SidebarData } from './sidebarData';
import ArticleIcon from '@mui/icons-material/Article';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { NavLink } from 'react-router-dom';

const menuItem = [
    {
        title: "New Doc File",
        icon: ArticleIcon
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
    //State

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    const handleNameFolder = () => {
        setNameFolder(true)
        setOpenMenu(!openMenu)
    }


    return (
        <div className='sidebar_container'>
            <div className="newBtnContainer" onClick={handleOpenMenu}>
                <AddIcon />

                <span>New</span>
            </div>

            <div className={`new_dropdown_menu ${openMenu ? 'active' : 'inactive'}`}>
                {menuItem.map((item) => {
                    return (
                        <div className='menu_item' onClick={item.title === 'New Folder' ? handleNameFolder : null}>
                            <item.icon/>
                            {item.title}
                        </div>
                    )
                })}
            </div>

            <div className='sidebar_item_container'>
                {SidebarData.map((item) => {
                    return (
                        <NavLink className={navClass => navClass.isActive ? 'active_sidebar_item' : 'inactive_sidebar_item'} to={item.path}>
                            <item.icon/>
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
                            <input type='text' className='input' placeholder='Type new name...'/>
                        </div>

                        <div className='newFolderBtnZone'>
                            <button className='nameFolderBtn' onClick={() => {setNameFolder(false)}}>Cancel</button>

                            <button className='nameFolderBtn' onClick={() => {setNameFolder(false)}}>Create</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default Sidebar

import React, { useState } from 'react'
import './removedFolder.css'
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const RemovedFolder = ({ folder }) => {
  const [showMenu, setShowMenu] = useState(false)

  const handleOpenMoreMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleRestoreFolder = () => {

  }

  const handleDeleteFolder = () => {

  }

  return (
    <div style={{ width: '19.2%', position: 'relative', }}>
      <div className='folderBtn' >
        <FolderIcon className='icon' />

        <span className='folderName'>{folder.name}</span>

        <div className='moreBtn' onClick={handleOpenMoreMenu}>
          <MoreVertIcon className='icon' />
        </div>
      </div>

      <div className={`folderMenu ${showMenu ? 'fileMenuActive' : 'fileMenuInactive'}`} >
        <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleRestoreFolder}>
          <RestoreIcon />

          Restore
        </div>

        <div className='menuItem' style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8}} onClick={handleDeleteFolder}>
          <DeleteOutlineIcon style={{padding: 0}}/>

          Delete
        </div>
      </div>
    </div>
  )
}

export default RemovedFolder

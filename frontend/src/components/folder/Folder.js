import React from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './folder.css'
import { useNavigate } from 'react-router-dom';

const Folder = ({ folder }) => {
  const navigate = useNavigate()

  const handleGoInsideFolder = () => {
    navigate(`/mystorage/folder/${folder.id}`, {state:{ folder: folder }})
  }

  const handleOpenMoreMenu = () => {
    console.log("clicked")
  }

  return (
    <div className='folderBtn' onDoubleClick={handleGoInsideFolder} >
      <FolderIcon className='icon' />

      <span className='folderName'>{folder.name}</span>

      <div className='moreBtn' onClick={handleOpenMoreMenu}>
        <MoreVertIcon className='icon'/>
      </div>
    </div>
  )
}

export default Folder

import React, { useState } from 'react'
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import './folder.css'
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { database } from '../../firebase/firebase';

const Folder = ({ folder }) => {
  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)

  const handleGoInsideFolder = () => {
    navigate(`/mystorage/folder/${folder.id}`, { state: { folder: folder } })
  }

  const handleOpenMoreMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu)
  }

  const handleDeleteFolder = () => {
    database.folders.doc(folder.id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });

    
  }


  return (
    <div style={{ width: '19.2%', position: 'relative', }}>
      <div className='folderBtn' onClick={handleGoInsideFolder} >
        <FolderIcon className='icon' />

        <span className='folderName'>{folder.name}</span>

        <div className='moreBtn' onClick={handleOpenMoreMenu}>
          <MoreVertIcon className='icon' />
        </div>




      </div>

      <div className={`menu ${showMenu ? 'menuActive' : 'menuInactive'}`} onClick={handleDeleteFolder}>
        <DeleteOutlineIcon />

        Move to Trash
      </div>
    </div>
  )
}

export default Folder

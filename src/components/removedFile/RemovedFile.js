import React, { useState } from 'react'
import './removedFile.css'
import fileImage from '../../assets/images/file.png'
import mp3 from '../../assets/images/mp3.png'
import powerpoint from '../../assets/images/powerpoint.png'
import txt from '../../assets/images/txt.png'
import video from '../../assets/images/video.png'
import word from '../../assets/images/word.png'
import pdf from '../../assets/images/pdf.png'
import image from '../../assets/images/image.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RestoreIcon from '@mui/icons-material/Restore';
import { database } from '../../firebase/firebase'

const RemovedFile = ({ file }) => {
  const [showMenu, setShowMenu] = useState(false)

  const getFileImage = (className) => {
    switch (file.type) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        return <img alt='' src={word} className={className} />
      }

      case 'application/msword': {
        return <img alt='' src={word} className={className} />
      }

      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
        return <img alt='' src={powerpoint} className={className} />
      }

      case 'video/mp4': {
        return <img alt='' src={video} className={className} />
      }

      case 'image/png': {
        return <img alt='' src={file.url} className={`${className} image`} />
      }

      case 'image/jpeg': {
        return <img alt='' src={file.url} className={`${className} image`} />
      }

      case 'text/plain': {
        return <img alt='' src={txt} className={className} />
      }

      case 'application/pdf': {
        return <img alt='' src={pdf} className={className} />
      }

      case 'audio/mpeg': {
        return <img alt='' src={mp3} className={className} />
      }

      default: {
        return <img alt='' src={fileImage} className={className} />
      }
    }
  }

  const handleOpenMoreMenu = () => {
    setShowMenu(!showMenu)
  }

  const handleRestoreFile = () => {
    database.removedFiles.doc(file.id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
    
    database.files.doc(file.id).set({
      name: file.name,
      type: file.type,
      folderId: file.folderId,
      createdAt: file.createdAt,
      modifiedDate: file.modifiedDate,
      upload: file.upload,
      url: file.url,
      userId: file.userId
    })
  }

  const handleDeleteFile = () => {
    database.removedFiles.doc(file.id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });
  }

  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.type === 'text/plain'
    || file.type === 'application/msword'
    || file.type === 'image/png'
    || file.type === 'image/jpeg'
    || file.type === 'image/gif'
  ) {
    return (
      <div style={{ width: '19.2%', position: 'relative' }}>
        <div className='fileContainer'>
          <div className='nameWrapper'>
            {(file.type === 'image/png'
              || file.type === 'image/jpeg'
              || file.type === 'image/gif'
            )
              ? <img src={image} className='fileIcon' alt='' />
              : getFileImage('fileIcon')}

            <span className='fileName'>{file.name}</span>

            <div className='moreBtn' onClick={handleOpenMoreMenu}>
              <MoreVertIcon className='icon' />
            </div>
          </div>

          <div className='imageWrapper'>
            {getFileImage('fileImage')}
          </div>
        </div>

        <div className={`fileMenu ${showMenu ? 'fileMenuActive' : 'fileMenuInactive'}`}>
          <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleRestoreFile}>
            <RestoreIcon />

            Restore
          </div>

          <div className='menuItem' style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} onClick={handleDeleteFile}>
            <DeleteOutlineIcon style={{ padding: 0 }} />

            Delete
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div style={{ width: '19.2%', position: 'relative' }}>
        <div className='fileContainer'>
          <div className='nameWrapper'>
            {file.type === 'image/png'
              ? <img src={image} className='fileIcon' alt='' />
              : getFileImage('fileIcon')}

            <span className='fileName'>{file.name}</span>

            <div className='moreBtn' onClick={handleOpenMoreMenu}>
              <MoreVertIcon className='icon' />
            </div>
          </div>

          <div className='imageWrapper'>
            {getFileImage('fileImage')}
          </div>
        </div>

        <div className={`fileMenu ${showMenu ? 'fileMenuActive' : 'fileMenuInactive'}`}>
          <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleRestoreFile}>
            <RestoreIcon />

            Restore
          </div>

          <div className='menuItem' style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} onClick={handleDeleteFile}>
            <DeleteOutlineIcon style={{ padding: 0 }} />

            Delete
          </div>
        </div>
      </div>
    )
  }
}

export default RemovedFile

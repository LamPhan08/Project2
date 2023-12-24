import React, { useState } from 'react'
import './file.css'
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useNavigate } from 'react-router-dom'

const File = ({ file }) => {
  const navigate = useNavigate()
  const [viewImage, setViewImage] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getFileImage = (className) => {
    switch (file.type) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
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

  const handleOpenMoreMenu = (e) => {
    e.stopPropagation();

    setShowMenu(!showMenu)
  }

  const handleViewImage = () => {
    setViewImage(!viewImage)
  }

  const handleOpenTextFile = async () => {
    navigate('/text-editor', { state: file })
  }

  const handleDeleteFile = () => {
    console.log('delete file')
  }

  const handleOpenLink = () => {
    window.open(file.url, '_blank')
  }

  const handleDownloadFile = () => {
    console.log('download file')
  }


  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.type === 'text/plain'
    || file.type === 'image/png'
    || file.type === 'image/jpeg'
    || file.type === 'image/gif'
  ) {
    return (
      <div style={{ width: '19.2%', position: 'relative' }}>
        <div className='fileContainer' onClick={(file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif') ? handleViewImage : handleOpenTextFile}>
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

        {viewImage &&
          <div className='popupImage'>
            <span onClick={handleViewImage}>&times;</span>

            <img src={file.url} alt="" />
          </div>
        }

        <div className={`fileMenu ${showMenu ? 'fileMenuActive' : 'fileMenuInactive'}`}>
          <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleDownloadFile}>
            <FileDownloadIcon />

            Download File
          </div>

          <div className='menuItem' style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} onClick={handleDeleteFile}>
            <DeleteOutlineIcon />

            Move to Trash
          </div>
        </div>
      </div>
    )
  }
  else {
    return (
      <div style={{ width: '19.2%', position: 'relative' }}>
        <div className='fileContainer' onClick={handleOpenLink}>
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
          <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleDownloadFile}>
            <FileDownloadIcon />

            Download File
          </div>

          <div className='menuItem' style={{ borderBottomLeftRadius: 8, borderBottomRightRadius: 8 }} onClick={handleDeleteFile}>
            <DeleteOutlineIcon />

            Move to Trash
          </div>
        </div>
      </div>
    )
  }
}

export default File

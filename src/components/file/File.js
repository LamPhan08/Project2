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
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useNavigate } from 'react-router-dom'
import { database } from '../../firebase/firebase';
import axios from 'axios'
import mammoth from 'mammoth'
import ModalShareUser from '../modalShareUser/ModalShareUser'

const FileCard = ({ file }) => {
  const navigate = useNavigate()
  const [viewImage, setViewImage] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [openModal, setOpenModal] = useState(false)

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
    database.files.doc(file.id).delete()
      .then(() => {
        console.log('Document successfully deleted!');
      })
      .catch((error) => {
        console.error('Error removing document: ', error);
      });

    database.removedFiles.doc(file.id).set({
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

  const handleOpenLink = () => {
    window.open(file.url, '_blank')
  }

  const handleDownloadFile = async () => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && file.type !== 'application/msword') {
      try {
        const response = await fetch(file.url)

        const blob = await response.blob();

        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
      }
      catch (err) {
        console.error('Error downloading file:', err);
      }
    }
    else {
      if (file.upload === true) {
        console.log(file.upload)
        try {
          const response = await fetch(file.url)
  
          const blob = await response.blob();
  
          const blobUrl = URL.createObjectURL(blob);
  
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = file.name
  
          document.body.appendChild(link);
  
          link.click();
  
          document.body.removeChild(link);
        }
        catch (err) {
          console.error('Error downloading file:', err);
        }
      }
      else {
        console.log(file.url)
        axios.get(file.url, { responseType: 'arraybuffer' })
        .then(response => {
          // console.log('response:', response.data)

          mammoth.extractRawText({ arrayBuffer: response.data })
          .then((result) => {
            const blob = new Blob([result.value], {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });

            const newFile = new File([blob], file.name, { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })

            // Specify link url
            const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(result.value);

            // Specify file name

            // Create download link element
            const downloadLink = document.createElement("a");

            document.body.appendChild(downloadLink);

            if (navigator.msSaveOrOpenBlob) {
              navigator.msSaveOrOpenBlob(newFile, file.name);
            } else {
              // Create a link to the file
              downloadLink.href = url;

              // Setting the file name
              downloadLink.download = file.name + '.doc';

              //triggering the function
              downloadLink.click();
            }

            document.body.removeChild(downloadLink);
          })
          .catch((error) => {
            console.error('Error extracting text from DOCX:', error);
          });
        })
      }
    }

    setShowMenu(!showMenu)
  }

  const handleShareFile = () => {
    setOpenModal(true)
    
    setShowMenu(!showMenu)
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

        <ModalShareUser isOpen={openModal} setIsOpen={setOpenModal} file={file}/>
        

        {viewImage &&
          <div className='popupImage'>
            <span onClick={handleViewImage}>&times;</span>

            <img src={file.url} alt="" />
          </div>
        }

        <div className={`fileMenu ${showMenu ? 'fileMenuActive' : 'fileMenuInactive'}`}>
          {/* <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleDownloadFile}>
            <FileDownloadIcon />

            Download File
          </div> */}

          <div className='menuItem' style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }} onClick={handleShareFile}>
            <PersonAddAlt1Icon />

            Share
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

export default FileCard

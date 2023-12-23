import React from 'react'
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
import {useNavigate} from 'react-router-dom'
import mammoth from 'mammoth'

const File = ({ file }) => {
  const navigate = useNavigate()

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
    console.log('clicked')
  }

  const handleViewImage = () => {

  }

  const handleOpenTextFile = async () => {
    let textContent
    console.log(file.url)

    // if (file.type === 'text/plain') {
    //   // const response = await fetch(file.url)

    //   // console.log(response)
    //   try {
    //     const response = await fetch(file.url, { mode: 'no-cors' })

    //     console.log(response)
    //   }
    //   catch(err) {
    //     console.log(err)
    //   }
    // }

    navigate('/text-editor')
  }


  if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    || file.type === 'text/plain'
    || file.type === 'image/png') {
    return (
      <div className='fileContainer' onClick={file.type === 'image/png' ? handleViewImage : handleOpenTextFile}>
        <div className='nameWrapper'>
          {file.type === 'image/png'
            ? <img src={image} className='fileIcon' alt=''/>
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
    )
  }
  else {
    return (
        <a href={file.url} target="_blank" className='fileContainer'>
          <div className='nameWrapper'>
            {file.type === 'image/png'
              ? <img src={image} className='fileIcon' />
              : getFileImage('fileIcon')}

            <span className='fileName'>{file.name}</span>

            <div className='moreBtn' onClick={handleOpenMoreMenu}>
              <MoreVertIcon className='icon' />
            </div>
          </div>

          <div className='imageWrapper'>
            {getFileImage('fileImage')}
          </div>
        </a>
    )
  }
}

export default File

import React, { useState } from 'react'
import './searchItemCard.css'
import fileImage from '../../assets/images/file.png'
import mp3 from '../../assets/images/mp3.png'
import powerpoint from '../../assets/images/powerpoint.png'
import txt from '../../assets/images/txt.png'
import video from '../../assets/images/video.png'
import word from '../../assets/images/word.png'
import pdf from '../../assets/images/pdf.png'
import image from '../../assets/images/image.png'
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom'


const SearchItemCard = ({ file, folder, setSearchText }) => {
    const navigate = useNavigate()

    const [viewImage, setViewImage] = useState(false)

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
                return <img alt='' src={image} className={className} />
            }

            case 'image/jpeg': {
                return <img alt='' src={image} className={className} />
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

    const handleViewImage = () => {
        setViewImage(!viewImage)

        // if (setSearchText) {
        //     setSearchText('')
        // }
    }

    const handleOpenTextFile = async () => {
        navigate('/text-editor', { state: file })
    }

    const handleOpenLink = () => {
        window.open(file.url, '_blank')

        if (setSearchText) {
            setSearchText('')
        }
    }

    const handleGoInsideFolder = () => {
        navigate(`/mystorage/folder/${folder.id}`, { state: { folder: folder } })

        if (setSearchText) {
            setSearchText('')
        }
    }

    if (file) {
        return (
            <div
                className='searchItem'
                onClick={
                    (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/gif')
                        ? handleViewImage
                        : (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword' || file.type === 'text/plain'
                            ? handleOpenTextFile
                            : handleOpenLink
                        )
                }
            >
                {getFileImage('fileIcon')}

                {file.name}

                {viewImage &&
                    <div className='popupImage' style={{zIndex: 999}}>
                        <span onClick={handleViewImage}>&times;</span>

                        <img src={file.url} alt="" />
                    </div>
                }
            </div>
        )
    }
    else {
        return (
            <div className='searchItem' onClick={handleGoInsideFolder}>
                <FolderIcon />

                {folder.name}
            </div>
        )
    }
}

export default SearchItemCard

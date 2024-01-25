import React from 'react'
import './sharedWithMe.css'
import { useFolder } from '../../hooks/useFolder'
import nothing from '../../assets/images/nothing.png'
import SharedFile from '../../components/sharedFile/SharedFile'

const SharedWithMe = () => {
  const { sharedFiles } = useFolder()

  // console.log(sharedFiles)

  return (
    <div style={{ padding: 20 }}>
      {sharedFiles?.length === 0
        && <div className='nothingWrapper'>
          <img src={nothing} className='nothingImg' />
          There's nothing here!
        </div>
      }

      {sharedFiles?.length > 0 && <span className='title' style={{ fontSize: 26, fontWeight: '500', color: '#000' }}>Files</span>}

      {sharedFiles?.length > 0
        && <div className='d-flex flex-wrap' style={{ gap: '1%', marginTop: 10 }}>
          {sharedFiles.map(sharedFile => (
            <SharedFile file={sharedFile} key={sharedFile.id} />
          ))}
        </div>}
    </div>
  )
}

export default SharedWithMe

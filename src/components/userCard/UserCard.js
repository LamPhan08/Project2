import React, { useState } from 'react'
import userIcon from '../../assets/images/user.png'
import './userCard.css'
import { database } from '../../firebase/firebase';

const UserCard = ({ user, file }) => {
  const [isShared, setIsShared] = useState(false)

  const handleShareFile = () => {
    setIsShared(!isShared)

    database.sharedFiles
      .where("id", "==", file.id)
      .where("sharedUser", "==", user.id)
      .get()
      .then(existingFiles => {
        if (existingFiles.empty) {
          database.sharedFiles.add({
            // name: file.name,
            // type: file.type,
            // folderId: file.folderId,
            // createdAt: file.createdAt,
            // modifiedDate: file.modifiedDate,
            // upload: file.upload,
            // url: file.url,
            // userId: file.userId,
            ...file,
            sharedUser: user.id
          })
        }
      })
  }

  return (
    <div style={{ display: 'flex', height: 40, padding: '5px 10px', alignItems: 'center', gap: 10 }}>
      <img src={userIcon} alt='' style={{ height: 30, width: 30 }} />

      <span style={{ flex: 1 }}>{user.email}</span>

      <button className='shareBtn' onClick={handleShareFile} disabled={isShared ? true : false}>
        {isShared ? 'Shared' : 'Share'}
      </button>
    </div>
  )
}

export default UserCard

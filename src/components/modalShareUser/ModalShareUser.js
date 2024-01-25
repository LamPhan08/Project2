import React, { useState } from 'react'
import './modalShareUser.css'
import Modal from 'react-modal'
import { Button } from 'react-bootstrap';
import { useFolder } from '../../hooks/useFolder';
import UserCard from '../userCard/UserCard';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '55%',
    zIndex: 999,
    
  },
};

const ModalShareUser = ({ isOpen, setIsOpen, file }) => {
  const [searchText, setSearchText] = useState('')

  const {users} = useFolder()

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setSearchText('')
        setIsOpen(!isOpen)
      }}
      style={customStyles}
    >
      <div style={{ height: '100%' }}>
        <div style={{ justifyContent: 'end', display: 'flex' }}>
          <span className='closeBtn' onClick={() => {
            setIsOpen(!isOpen)
            setSearchText('')
          }}>&times;</span>
        </div>  


        <div style={{fontSize: 20, fontWeight: '500'}}>
          Share "{file.name}"
        </div>

        <div className="searchBar" style={{ height: 40, width: '100%',marginTop: 20 }}>
          <input type="text" placeholder='Input user email...' value={searchText} onChange={e => setSearchText(e.target.value)} />
        </div>

        <div style={{ overflowY: 'scroll', height: '50%', marginTop: 20, border: '0.5px solid #ddd', borderRadius: 8,}}>
          {searchText !== '' &&
            users?.filter(user => user.email.toLowerCase().includes(searchText.toLowerCase())).map((user) => {
              return (
                <UserCard user={user} file={file} key={user.id}/>
              )
            })
          }
        </div>

        <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
          <Button className='resetPasswordBtn' style={{ width: 200, border: 'none' }} onClick={() => {
            setSearchText('')
            setIsOpen(!isOpen)
          }}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ModalShareUser

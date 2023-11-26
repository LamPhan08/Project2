import React from 'react'
import MyStorage from '../screens/myStorage/MyStorage'
import Trash from '../screens/trash/Trash'
import {Routes, Route, Navigate} from 'react-router-dom'

const Routers = () => {
  return (
    <Routes>
      <Route path='/' element={<Navigate to='/mystorage'/>}/>
      <Route path='/mystorage' element={<MyStorage/>}/>
      <Route path='/mystorage/folder/:folderId' element={<MyStorage/>}/>
      <Route path='/trash' element={<Trash/>}/>
    </Routes>
  )
}

export default Routers

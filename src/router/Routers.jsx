import React from 'react'
import MyStorage from '../pages/myStorage/MyStorage'
import Trash from '../pages/trash/Trash'
import {Routes, Route, Navigate} from 'react-router-dom'
import Login from '../pages/login/Login'
import Register from '../pages/register/Register'
import ForgotPassword from '../pages/forgotPassword/ForgotPassword'
import { useAuth } from '../contexts/AuthContext'
import TextEditor from '../pages/textEditor/TextEditor'
import SharedWithMe from '../pages/sharedWithMe/SharedWithMe'

const Routers = () => {
  const {currentUser} = useAuth()

  return (
    <Routes>
      <Route path='/' element={<Navigate to={currentUser ? '/mystorage' : '/login'}/>}/>
      <Route path='/mystorage' element={<MyStorage/>}/>
      <Route path='/mystorage/folder/:folderId' element={<MyStorage/>}/>
      <Route path='/trash' element={<Trash/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/text-editor' element={<TextEditor/>}/>
      <Route path='/sharedwithme' element={<SharedWithMe/>}/>
    </Routes>
  )
}

export default Routers

import React from 'react'
import Header from '../header/Header'
import Sidebar from '../sidebar/Sidebar'
import Routers from '../../router/Routers'
import './layout.css'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation } from 'react-router-dom'
import TextEditor from '../../pages/textEditor/TextEditor'

const Layout = () => {
  const { currentUser } = useAuth()
  const {pathname} = useLocation()
  console.log(pathname)

  if (currentUser) {
    if (pathname !== '/text-editor') {
      return (
        <div className='layout_container'>
          <Header />
  
          <div className='main_container'>
            <Sidebar />
  
            <div className="main_content">
              <Routers />
            </div>
          </div>
        </div>
      )
    }
    else {
      return (
        <div className="layout_container">
          <Header/>

          <Routers />
        </div>
      )
    }
  }
  else {
    return (
      <Routers />
    )
  }
}

export default Layout

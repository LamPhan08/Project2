import React from 'react'
import Header from '../header/Header'
import Sidebar from '../sidebar/Sidebar'
import Routers from '../../router/Routers'
import './layout.css'

const Layout = () => {
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

export default Layout

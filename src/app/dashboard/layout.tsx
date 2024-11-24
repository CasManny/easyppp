import React, { ReactNode } from 'react'
import DashboardNavbar from './_components/DashboardNavbar'

const DashboardLayout = ({ children }: { children: ReactNode}) => {
  return (
      <div className='bg-accent/5 min-h-screen'>
          <DashboardNavbar />
          <div className="container py-6">
              {children}
          </div>
    </div>
  )
}

export default DashboardLayout
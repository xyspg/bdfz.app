import React from 'react'
import Footer from '@/components/ui/Footer'
import { NewHeader } from './Header'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-white dark:bg-neutral-800">
        <div className="flex-grow w-screen min-h-screen md:min-h-0">
          <NewHeader />
          <main className="px-4 md:px-8">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout

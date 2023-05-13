import React from 'react'
import Footer from '@/components/ui/Footer'

type LayoutProps = {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-white dark:bg-neutral-800">
        <div className="flex-grow px-2 py-6 md:p-18 w-screen max-w-5xl lg:p-24 xl:p-28 2xl:p-32">
          <main>{children}</main>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Layout

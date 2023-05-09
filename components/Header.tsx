import React from 'react'
import Image from 'next/image'
import SwitchTheme from '@/components/SwitchTheme'

const Header = () => {
  return (
    <>
      <header className="flex flex-row items-center justify-between mb-8 px-2 pr-2">
        <h1 className="p-4 text-slate-700 font-bold text-2xl font-mono flex items-center gap-3 dark:text-slate-200">
          <Image src={'/logo.png'} width="32" height="32" alt="MagickPen logo" /> BDFZ AI
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-opacity-10 bg-scale-200 text-scale-1100 border border-scale-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="!mr-1.5 !w-3.5 !h-3.5"
            >
              <path d="M6 18h8"></path>
              <path d="M3 22h18"></path>
              <path d="M14 22a7 7 0 1 0 0-14h-1"></path>
              <path d="M9 14h2"></path>
              <path d="M8 6h4"></path>
              <path d="M13 10V6.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2.5a.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V10c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2Z"></path>
            </svg>
            Beta
          </span>
        </h1>
        <SwitchTheme />
      </header>
    </>
  )
}

export default Header

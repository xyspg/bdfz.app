'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'

const SwitchTheme = () => {
  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const darkMode = currentTheme === 'dark'

  return (
    <div
      onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
      className={`text-${
        darkMode ? 'white' : 'black'
      } cursor-pointer transition-all duration-100  text-2xl md:text-2xl rounded-lg `}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </div>
  )
}

export default SwitchTheme

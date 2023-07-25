import React from 'react'
import Link from 'next/link'
import { Github, LogOut, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  EnvelopeClosedIcon,
  HamburgerMenuIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons'
import { AnimatePresence, motion } from 'framer-motion'

import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'

const DropDownNotLogin = () => {
  const supabaseClient = useSupabaseClient()
  const session = useSession()
  const router = useRouter()
  const signOutUser = async () => {
    try {
      await supabaseClient.auth.signOut()
      router.push('/')
      router.reload()
    } catch (error: any) {
      console.error('Error signing out:', error.message)
    }
  }

  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme
  const darkMode = currentTheme === 'dark'

  const user = useUser()
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="inline-block w-12 h-12 cursor-pointer">
          <HamburgerMenuIcon className="w-5 h-5 m-2 dark:text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-8 mt-0.5 pt-2 w-56 bg-white min-w-min">
          {!session ? (
            <Link href="/">
              <DropdownMenuLabel>BDFZ AI</DropdownMenuLabel>
            </Link>
          ) : (
            <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-300">
              {user?.email}
            </DropdownMenuLabel>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                <span>主题</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-white">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                    <SunIcon className="mr-2 h-4 w-4" />
                    <span>日间模式</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                    <MoonIcon className="mr-2 h-4 w-4" />
                    <span>夜间模式</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                    <LaptopIcon className="mr-2 h-4 w-4" />
                    <span>跟随系统</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <a href="mailto:support@bdfz.app">
            <DropdownMenuItem>
              <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
              <span>寻求帮助</span>
            </DropdownMenuItem>
          </a>
          <Link href="https://github.com/xyspg/bdfz.app" rel="noopener noreferrer" target="_blank">
            <DropdownMenuItem>
              <Github className="mr-2 h-4 w-4" />
              <span>GitHub</span>
            </DropdownMenuItem>
          </Link>
          {session && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOutUser()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>注销</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

const UserPopOver = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DropDownNotLogin />
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default UserPopOver

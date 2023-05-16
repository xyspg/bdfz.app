import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, LogOut, Settings, User } from 'lucide-react'
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
  ChatBubbleIcon,
  HamburgerMenuIcon,
  LaptopIcon,
  MoonIcon,
  SunIcon,
  EnvelopeClosedIcon
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
        <DropdownMenuTrigger asChild className='inline-block w-12 h-12 cursor-pointer'>
          <HamburgerMenuIcon className="w-5 h-5 m-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mt-0.5 pt-2 w-56 bg-white min-w-min">
          {!session ? (
            <Link href="/">
              <DropdownMenuLabel>BDFZ AI</DropdownMenuLabel>
            </Link>
          ) : (
            <DropdownMenuLabel className="text-xs text-neutral-500 dark:text-neutral-300">{user?.email}</DropdownMenuLabel>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {!session ? (
              <Link href="/login">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>登录 / 注册</span>
                </DropdownMenuItem>
              </Link>
            ) : (
              <>
                <Link href="/">
                  <DropdownMenuItem>
                    <ChatBubbleIcon className="mr-2 h-4 w-4" />
                    <span>BFDZ AI</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                <span>设置</span>
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

const Header = () => {
  const session = useSession()
  const supabase = useSupabaseClient()
  return (
    <>
      <header className="flex flex-row items-center justify-between mb-8 px-4 py-6 md:px-12 ">
        <h1 className=" text-slate-700 font-bold text-2xl font-mono flex flex-row items-center gap-3 dark:text-slate-200 ">
          <div className="flex flex-row gap-1.5 relative">
            <Image src={'/icon.png'} width="32" height="32" alt="logo" /> <span>bdfz.app</span>
            <Link href="/" className="absolute inset-0" />
          </div>
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
              <path d="M6 18h8"></path> <path d="M3 22h18"></path>
              <path d="M14 22a7 7 0 1 0 0-14'-1"></path>
              <path d="M9 14h2"></path>
              <path d="M8 6h4"></path>
              <path d="M13 10V6.5a.5.5 0 0 0-.5-.5.5.5 0 0 1'.5-.5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2.5a.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V10c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2Z"></path>
            </svg>
            Beta
          </span>
        </h1>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <DropDownNotLogin />
          </motion.div>
        </AnimatePresence>
      </header>
    </>
  )
}

export default Header

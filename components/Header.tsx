//@ts-nocheck
import React, { useContext } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Popover } from '@headlessui/react'

import { Button } from '@/components/ui/Button'
import { Container } from '@/components/intro/Container'
import { Logo } from '@/components/intro/Logo'
import { NavLinks } from '@/components/NavLinksLoggedIn'
import OpenAILogo from '@/images/logos/openai.svg'
import OpenAIDarkLogo from '@/images/logos/openai_dark.svg'

import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import { UserStatusContext } from '@/lib/userContext'

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M17 14l-5-5-5 5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MobileNavLink({ children, ...props }) {
  return (
    <Popover.Button
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    >
      {children}
    </Popover.Button>
  )
}

function OpenAI(props) {
  return (
    <>
      <div
        {...props}
        className="rounded-sm flex items-center relative text-black dark:stroke-white h-9 w-9"
      >
        <Link href="/chat" className="absolute inset-0 cursor-pointer"></Link>
      </div>
    </>
  )
}

export function NewHeader() {
  const supabaseClient = useSupabaseClient()
  const session = useSession()
  const user = useUser()
  const userid = user?.id
  const router = useRouter()
  const pathname = router.pathname
  const signOutUser = async () => {
    try {
      await supabaseClient.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error.message)
    }
  }

  const { systemTheme, theme, setTheme } = useTheme()
  const currentTheme = theme === 'system' ? systemTheme : theme

  const { isPaidUser, isAdmin } = useContext(UserStatusContext)
  const MobileNavLinks = [
    isPaidUser && { name: 'GPT4', href: '/gpt4' },
    isAdmin && { name: '仪表盘', href: '/dashboard' },
    { name: '历史记录', href: '/history' },
    { name: '设置', href: '/settings' },
    { name: '贡献新文档', href: `/survey/upload?id=${userid}` },
  ]

  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            {pathname === '/gpt4' ? (
              <Image
                src={currentTheme === 'light' ? OpenAILogo : OpenAIDarkLogo}
                alt="OpenAI Logo"
                className="cursor-pointer"
                onClick={() => router.push('/chat')}
              />
            ) : (
              <Link href="/chat" aria-label="Home">
                <Logo className="h-10 w-auto" />
              </Link>
            )}

            <div className="hidden lg:flex lg:gap-10 items-center">
              <NavLinks />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <Popover className="lg:hidden">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 [&:not(:focus-visible)]:focus:outline-none dark:stroke-neutral-200
                      dark:hover:stroke-neutral-200
                    "
                    >
                      {({ open }) =>
                        open ? (
                          <ChevronUpIcon className="h-6 w-6" />
                        ) : (
                          <MenuIcon className="h-6 w-6" />
                        )
                      }
                    </Popover.Button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <>
                          <Popover.Overlay
                            static
                            as={motion.div}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-0 bg-gray-300/60 dark:bg-gray-900/30 backdrop-blur"
                          />
                          <Popover.Panel
                            static
                            as={motion.div}
                            initial={{ opacity: 0, y: -32 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{
                              opacity: 0,
                              y: -32,
                              transition: { duration: 0.2 },
                            }}
                            className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 dark:bg-gray-900 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
                          >
                            <div className="space-y-4">
                              {MobileNavLinks.filter((link) => link).map((link) => (
                                <MobileNavLink key={link.name} href={link?.href}>
                                  <span className="flex flex-row gap-1 items-center dark:text-neutral-200">
                                    <span>{link.name}</span>
                                  </span>
                                </MobileNavLink>
                              ))}
                            </div>
                            <div className="mt-8 flex flex-col gap-4 ">
                              <Button
                                onClick={() => {
                                  signOutUser()
                                }}
                                variant="outline"
                              >
                                退出登录
                              </Button>
                            </div>
                          </Popover.Panel>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Popover>
              <div className="block md:hidden">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="hidden lg:flex items-center">
              <Button onClick={() => signOutUser()} variant="outline">
                退出登录
              </Button>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  )
}

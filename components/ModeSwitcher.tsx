import React, { useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { CardStackIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
const ModeSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    router.prefetch('/ask')
  }, [router])
  return (
    <>
      <div className="relative flex flex-col items-stretch justify-center gap-2 sm:items-center py-2">
        <div className="relative flex rounded-xl bg-gray-100 p-1 mx-6 dark:bg-neutral-900">
          <ul className="flex w-full list-none gap-1 sm:w-auto">
            <li className="group/toggle w-full">
              <button
                type="button"
                id="radix-:r8:"
                aria-haspopup="menu"
                aria-expanded="true"
                data-state="open"
                className="w-full"
                aria-controls="radix-:r9:"
              >
                <div
                  className={clsx(
                    'group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5',
                    pathname === '/chat'
                      ? 'bg-white dark:bg-[#40414E] dark:border-[#4E4F60] shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] border-black/10 text-gray-800 dark:text-gray-100'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:dark:text-gray-100 ',
                    'hover:!opacity-100'
                  )}
                  onClick={() => {
                    router.replace('/chat')
                  }}
                >
                  <span
                    className={clsx(
                      'relative max-[370px]:hidden',
                      pathname === '/chat' && 'text-red-900 dark:text-red-300'
                    )}
                  >
                    <MessageSquare width={18} height={18} />
                  </span>
                  <span className="truncate text-sm font-medium">连续对话</span>
                </div>
              </button>
            </li>
            <li className="group/toggle w-full">
              <button
                type="button"
                id="radix-:ra:"
                aria-haspopup="menu"
                aria-expanded="false"
                data-state="closed"
                className="w-full"
              >
                <div
                  className={clsx(
                    'group/button relative flex w-full items-center justify-center gap-1 rounded-lg border py-3 transition-opacity duration-100 sm:w-auto sm:min-w-[148px] md:gap-2 md:py-2.5',
                    pathname === '/ask'
                      ? 'bg-white dark:bg-[#40414E] dark:border-[#4E4F60] shadow-[0_1px_7px_0px_rgba(0,0,0,0.06)] border-black/10 text-gray-800 dark:text-gray-100'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:dark:text-gray-100 ',
                    'hover:!opacity-100'
                  )}
                  onClick={() => {
                    router.replace('/ask')
                  }}
                >
                  <span
                    className={clsx(
                      'relative max-[370px]:hidden',
                      pathname === '/ask' && 'text-red-900 dark:text-red-300'
                    )}
                  >
                    <CardStackIcon width={18} height={18} />
                  </span>
                  <span className="truncate text-sm font-medium">单次对话</span>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ModeSwitcher

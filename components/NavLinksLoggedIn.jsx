import { useContext, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { UserStatusContext } from '@/lib/userContext'

export function NavLinks() {
  const { isPaidUser, isAdmin } = useContext(UserStatusContext)

  const [hoveredIndex, setHoveredIndex] = useState(null)

  return [isPaidUser && ['GPT4', '/gpt4'], ['历史记录', '/history'], ['设置', '/settings']]
    .filter(Boolean)
    .map(([label, href], index) => (
      <Link
        key={label}
        href={href}
        className="relative -my-2 -mx-3 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors delay-150 hover:text-gray-900 hover:delay-[0ms] dark:text-neutral-200"
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <AnimatePresence>
          {hoveredIndex === index && (
            <motion.span
              className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-700"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{
                opacity: 0,
                transition: { duration: 0.15, delay: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
        <span className="relative z-10">{label}</span>
      </Link>
    ))
}

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'

export function NavLinks() {
  const [isAdmin, setIsAdmin] = useState(false)
  const user = useUser()
  const supabase = useSupabaseClient()
  const adminQuery = async () => {
    const { data: Admin, error } = await supabase
      .from('users')
      .select('is_super_admin')
      .eq('id', user?.id)
    if (error) {
      console.log(error)
    } else {
      const result = { data: Admin }.data[0]
      const isAdmin = result.is_super_admin === true
      setIsAdmin(isAdmin)
    }
  }
  adminQuery().then((r) => r)
  let [hoveredIndex, setHoveredIndex] = useState(null)

  return [
    isAdmin && ['GPT4', '/gpt4'],
    isAdmin && ['账单与付款', '/billing'],
    ['历史记录', '/history'],
    ['设置', '/settings'],
  ]
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

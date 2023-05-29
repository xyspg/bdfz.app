'use client'

import Link from 'next/link'
import { useRouter } from 'next/router'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const router = useRouter()
  const pathname = router.asPath

  return (
    <nav
      className={cn('flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1', className)}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted dark:hover:bg-neutral-700 dark:bg-neutral-900 '
              : 'hover:bg-transparent hover:underline dark:hover:bg-neutral-700 ',
            'justify-start'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

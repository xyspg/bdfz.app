import { Metadata } from 'next'
import Image from 'next/image'
import Layout from '@/components/Layout'

import { Separator } from '@/components/ui/separator'
import { SidebarNav } from '../../components/settings/sidebar-nav'

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
}

const sidebarNavItems = [
  {
    title: '个人资料',
    href: '/settings',
  },
  {
    title: '账户',
    href: '/settings/account',
  },
  {
    title: '外观',
    href: '/settings/appearance',
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <Layout>
      <div className="p-6 space-y-6 md:p-10 pb-16 md:block md:mx-20 dark:text-neutral-200">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-medium tracking-tight dark:text-neutral-100">设置</h2>
          <div className="text-muted-foreground dark:text-neutral-400">管理您的账户和偏好</div>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5 dark:text-neutral-200">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </Layout>
  )
}

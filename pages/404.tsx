import React from 'react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Layout from '@/components/Layout'

const NotFound = () => {
  return (
    <Layout>
      <div className="flex justify-center flex-col items-center gap-8">
        <h1 className="text-3xl text-center mt-12 font-mono font-medium">404 Not Found</h1>
        <Button variant="outline">
          <Link href="/">返回首页</Link>
        </Button>
        <p className="text-sm">
          遇到问题？联系
          <a
            className="text-indigo-900 dark:text-indigo-300 cursor-pointer px-1"
            href="mailto:support@bdfz.app"
          >
            support@bdfz.app
          </a>
        </p>
      </div>
    </Layout>
  )
}

export default NotFound

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex justify-center flex-col items-center gap-8">
      <h1 className="text-3xl text-center mt-12 font-mono font-bold">404 Not Found</h1>
      <Button variant="outline">
        <Link href="/">返回首页</Link>
      </Button>
      <p className="text-sm">
        遇到问题？联系{' '}
        <a className="text-indigo-900 cursor-pointer" href="mailto:support@bdfz.app">
          support@bdfz.app
        </a>
      </p>
    </div>
  )
}

export default NotFound

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

const Redirect = () => {
  const router = useRouter()
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full h-48">
      <p>登录成功，请刷新页面</p>
    </div>
    </>
  )
}

export default Redirect

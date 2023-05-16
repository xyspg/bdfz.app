import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '@/components/Header'

const Redirect = () => {
  const router = useRouter()
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => {
      clearTimeout(redirectTimer);
    };
  }, [router]);
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center w-full h-48">
      <p>登录成功，正在重定向……</p>
    </div>
    </>
  )
}

export default Redirect

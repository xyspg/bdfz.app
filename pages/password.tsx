import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { toast, ToastContainer } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordStrengthBar from 'react-password-strength-bar'
import 'react-toastify/dist/ReactToastify.css'

import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import Head from 'next/head'


const Password = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const session = useSession()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const handleSetNewPassword = async (password: string) => {
    if (passwordConfirm && password !== passwordConfirm) {
      toast.error('密码不一致', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      return
    }
    const { data, error } = await supabaseClient.auth.updateUser({ password: password })
    if (error) {
      let errorMessage = ''
      if (error.message === 'Password should be at least 6 characters') {
        errorMessage = '密码长度至少为 6 位'
      } else {
        errorMessage = error.message
      }
      toast.error(`${errorMessage}`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    } else {
      toast.success('密码设置成功', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      window.location.href = '/'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSetNewPassword(password)
    }
  }

  return (
    <>
      <Head>
        <title>设置密码 - bdfz.app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <Header />
      <ToastContainer />
      <div className="p-8 flex justify-center items-center">
        <div className="flex flex-col gap-2 w-full max-w-xl">
          <div>
            <h1 className="text-xl font-bold mb-2 ">设置密码</h1>
            <Input
              type="password"
              placeholder="输入新密码"
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <Input
              type="password"
              className="invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
              placeholder="确认密码"
              onChange={(e) => {
                setPasswordConfirm(e.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
          <PasswordStrengthBar
            password={password}
            shortScoreWord={'密码至少要6位哦～'}
            scoreWords={['太简单了', '弱诶', '一般', '还行', '强♡']}
          />
          <Button
            data-umami-event="change password"
            className="w-full bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
            onClick={() => handleSetNewPassword(password)}
          >
            设置密码
          </Button>
        </div>
      </div>
    </>
  )
}

export default Password

import React, { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { useSession, useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Input } from '@/components/ui/input'
import PasswordStrengthBar from 'react-password-strength-bar'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/router'
import Head from 'next/head'

const Profile = () => {
  const user = useUser()
  const session = useSession()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const checkPassword = (password: string, passwordConfirm: string) => {
    if (passwordConfirm && password !== passwordConfirm) return '两次输入的密码不一致'
    if (password.length < 6) return '密码长度至少为 6 位'
    return null
  }

  const handleClick = (password: string) => {
    if (!password)
      toast.error(`密码不能为空`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })

    checkPassword(password, passwordConfirm)
    if (passwordError) {
      alert(passwordError)
      return
    }
    UpdatePassword(password)
  }

  const UpdatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: password })
    if (error) {
      toast.error(`${error.message}`, {
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
      toast.success('密码修改成功', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    }
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick(password)
    }
  }

  return (
    <>
      <Head>
        <title>个人资料 - bdfz.app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <ToastContainer />
      <Header />
      {session && (
        <div className="flex justify-center">
          <div className="p-8 flex justify-center flex-col gap-8 w-full md:w-1/2">
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold">邮箱</h1>
              <h2 className="text-sm md:text-md font-semibold font-mono">{user?.email}</h2>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-3xl">
              <div>
                <h1 className="text-xl  font-bold mb-2 ">更改密码</h1>
                <Input
                  type="password"
                  placeholder="输入新密码"
                  onChange={(e) => {
                    setPassword(e.target.value)
                    const passwordError = checkPassword(e.target.value, passwordConfirm)
                    setPasswordError(passwordError)
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
                    const passwordError = checkPassword(password, e.target.value)
                    setPasswordError(passwordError)
                  }}
                  onKeyDown={handleKeyDown}
                />
                {password !== '' && (
                  <>

                  </>
                )}
              </div>
              <Button
                data-umami-event="change password"
                className="w-full bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
                onClick={() => handleClick(password)}
              >
                修改密码
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile

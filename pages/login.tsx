import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import * as React from 'react'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import PasswordStrengthBar from 'react-password-strength-bar'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'

const LoginPage = () => {
  const router = useRouter()
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loginOrSignup, setLoginOrSignup] = useState<'login' | 'signup'>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [typingTimeout, setTypingTimeout] = useState<number | undefined>(undefined)
  const { query } = useRouter()

  useEffect(() => {
    setAuthError(null)
    setPasswordError(null)
  }, [loginOrSignup])

  const checkPassword = (password: string, passwordConfirm: string) => {
    if (password.length < 6) return '密码长度至少为 6 位'
    if (passwordConfirm && password !== passwordConfirm) return '两次输入的密码不一致'
    return null
  }

  const handleClick = (email: string, password: string) => {
    if (!email) return setAuthError('邮箱不能为空')
    if (!password) return setAuthError('密码不能为空')

    if (loginOrSignup === 'login') {
      handleLogin(email, password)
    } else if (loginOrSignup === 'signup') {
      const error = checkPassword(password, passwordConfirm)
      if (error) {
        setPasswordError(error)
        alert(error)
        return
      }
      handleSignUp(email, password)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      if (error.message === 'Invalid login credentials') {
        toast.error(`用户名或密码错误`, {
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
      }
    }
  }

  const handleSignUp = async (email: string, password: string) => {
    const allowedDomains = ['i.pkuschool.edu.cn']
    const emailDomain = email.split('@')[1]

    function isValidEmail(email: string) {
      // Regular expression pattern for email validation
      const emailPattern = /^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
      return emailPattern.test(email)
    }

    if (!isValidEmail(email)) {
      toast.error(`邮箱格式错误`, {
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

    if (!allowedDomains.includes(emailDomain)) {
      toast.error(`为防止滥用，请使用学校邮箱注册`, {
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

    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
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
      toast.success('请检查收件箱', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      setLoginOrSignup('login')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick(email, password)
    }
  }

  if (!user)
    return (
      <>
        <ToastContainer />
        <div className="">
          <Header />
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-full md:w-1/2 max-w-md flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="请使用 @i.pkuschool.edu.cn 邮箱"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {loginOrSignup === 'signup' && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>确认密码</Label>
                    <Input
                      type="password"
                      className="invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                      onChange={(e) => {
                        setPasswordConfirm(e.target.value)
                        if (typingTimeout) {
                          clearTimeout(typingTimeout)
                        }
                        setTypingTimeout(
                          window.setTimeout(() => {
                            const passwordError = checkPassword(password, e.target.value)
                            setPasswordError(passwordError)
                          }, 1000)
                        )
                      }}
                      onKeyDown={handleKeyDown}
                    />
                    {password !== '' && (
                      <>
                        <PasswordStrengthBar
                          // shortScoreWord={'杂～鱼～杂鱼♡只有这么短吗'}
                          // scoreWords={[
                          //   '杂～鱼～杂鱼♡只有这么短吗',
                          //   '还是好短~',
                          //   '还行吧♡',
                          //   '啊～',
                          //   '不行了♡',
                          // ]}
                          shortScoreWord={'太短了'}
                          scoreWords={['太短了', '弱', '还行吧', '一般', '强']}
                          password={password}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
              {authError && <div className="text-red-500 text-sm">{authError}</div>}
              {loginOrSignup === 'signup' && passwordError && (
                <div className="text-red-500 text-sm text-center font-medium">{passwordError}</div>
              )}
              <Button
                data-umami-event={loginOrSignup === 'login' ? 'login' : 'signup'}
                className="w-full bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
                onClick={() => {
                  handleClick(email, password)
                }}
              >
                {loginOrSignup === 'login' ? '登录' : '注册'}
              </Button>
              <div className="flex flex-row justify-around">
                <p
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => {
                    loginOrSignup === 'login'
                      ? setLoginOrSignup('signup')
                      : setLoginOrSignup('login')
                  }}
                >
                  {loginOrSignup === 'login' ? '还没有账户？点击注册' : '已有账户？点击登录'}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">忘记密码</p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  if (query.redirect) {
    router.push(decodeURIComponent(query.redirect as string))
  } else {
    router.push('/')
  }
}

export default LoginPage

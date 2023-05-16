import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react'
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
import Head from 'next/head'
import { GitHubLogoIcon} from '@radix-ui/react-icons'

const LoginPage = () => {
  const router = useRouter()
  const session = useSession()
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [data, setData] = useState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [loginOrSignup, setLoginOrSignup] = useState<'login' | 'signup' | 'reset'>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [typingTimeout, setTypingTimeout] = useState<number | undefined>(undefined)
  const { query } = useRouter()

  useEffect(() => {
    setAuthError(null)
    setPasswordError(null)
  }, [loginOrSignup])

  useEffect(()=>{
    if(session) router.push('/')
  },[router, session])

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to including trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
  }

  const checkPassword = (password: string, passwordConfirm: string) => {
    if (password.length < 6) return '密码长度至少为 6 位'
    if (passwordConfirm && password !== passwordConfirm) return '两次输入的密码不一致'
    return null
  }

  const handleClick = (email: string, password: string) => {
    if (!email) return setAuthError('邮箱不能为空')
    if (!password && loginOrSignup !== 'reset') return setAuthError('密码不能为空')

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
    } else {
      router.push('/')
    }
  }

  const handleReset = async (email: string) => {
    toast.info('请稍候', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${getURL()}`,
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
      toast.success(`重置密码邮件已发送至 ${email}，请查收`, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
      // setRequestedRecovery(true)
    }
  }

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      if (event == 'PASSWORD_RECOVERY') {
        router.push('/password')
      }
    })
  }, [router, supabaseClient.auth])

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
    toast.info('请稍候', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    })

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

  async function signInWithAzure() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
      },
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
    }
  }

  async function signInWithGitHub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
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
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (loginOrSignup === 'reset') {
        handleReset(email)
      } else {
        handleClick(email, password)
      }
    }
  }
  if(session) router.push('/')
  if (!user) {
    return (
      <>
        <Head>
          <title>登录 - bdfz.app</title>
          <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
        </Head>
        <Header />
        <ToastContainer />
        <div>
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-full md:w-1/2 max-w-md flex flex-col gap-6">
              {/*
              I don't know why adding a gap-6 here will
              cause the layout to shift when opening dropdown menu
              therefore I replaced  the gap-6 with a mb-6 or mt-6 on the children of the flex container
              */}
              <div className="flex flex-col gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder={
                    loginOrSignup === 'login' || loginOrSignup === 'reset'
                      ? '请输入邮箱'
                      : '请使用 @i.pkuschool.edu.cn 邮箱'
                  }
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {loginOrSignup !== 'reset' && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>密码</Label>
                    <Input
                      type="password"
                      placeholder="请输入密码"
                      onChange={(e) => {
                        setPassword(e.target.value)
                      }}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </>
              )}

              {loginOrSignup === 'signup' && (
                <>
                  <div className="flex flex-col gap-2">
                    <Label>确认密码</Label>
                    <Input
                      type="password"
                      placeholder="请再次输入密码"
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
                          shortScoreWord={'密码至少要6位哦～'}
                          scoreWords={['太简单了', '弱诶', '一般', '还行', '强♡']}
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
                data-umami-event={
                  loginOrSignup === 'login'
                    ? 'login'
                    : loginOrSignup === 'reset'
                      ? 'reset pwd'
                      : 'signup'
                }
                className="w-full bg-red-900 block shadow-md hover:bg-red-800 dark:bg-red-900 dark:hover:bg-red-800"
                onClick={() => {
                  loginOrSignup !== 'reset' ? handleClick(email, password) : handleReset(email)
                }}
              >
                {loginOrSignup === 'login'
                  ? '登录'
                  : loginOrSignup === 'reset'
                    ? '重置密码'
                    : '注册'}
              </Button>
              {loginOrSignup !== 'reset' && (
                <div className='flex flex-col gap-4'>
                  <Button
                    className="w-full shadow-md bg-white hover:bg-slate-100 text-neutral-700 flex flex-row justify-center gap-2"
                    onClick={signInWithAzure}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 23 23"
                      width={20}
                      height={20}
                    >
                      <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                    <p> 使用 Microsoft 登录</p>
                  </Button>
                  <Button
                    className="w-full shadow-md bg-white hover:bg-slate-100 text-neutral-700 flex flex-row justify-center gap-2"
                    onClick={signInWithGitHub}
                  >
                    <GitHubLogoIcon width='20' height='20' />
                    <p> 使用 GitHub 登录</p>
                  </Button>
                </div>
              )}
              <div className="flex flex-row justify-around">
                {loginOrSignup !== 'reset' && (
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
                )}
                <p
                  className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  onClick={() => {
                    loginOrSignup === 'reset'
                      ? setLoginOrSignup('login')
                      : setLoginOrSignup('reset')
                  }}
                >
                  {loginOrSignup === 'reset' ? '返回登录' : '忘记密码'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default LoginPage

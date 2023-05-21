import { Button } from '@/components/ui/button'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginAzure = () => {
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

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
  return (
    <>
      <Head>
        <title>登录 - bdfz.app</title>
        <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1" />
      </Head>
      <ToastContainer />
      <div className="">
        <div className="flex flex-col items-center justify-center p-8 my-52">
          <div className="w-full md:w-1/2 max-w-md flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <Button
                className="w-full shadow-md bg-white  hover:bg-slate-100  text-neutral-700 flex flex-row justify-center gap-2"
                onClick={signInWithAzure}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width={20} height={20}>
                  <path fill="#f3f3f3" d="M0 0h23v23H0z" />
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                <p> 使用学校 Microsoft 账号登录</p>
              </Button>
            </div>

            <div className="flex justify-center">
              <Link
                href='/login/email'
                className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
              >
                使用邮箱登录
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginAzure

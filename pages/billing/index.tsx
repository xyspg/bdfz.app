/*

* This page is only for demostration purpose only. No payment logic is implemented

*/

import React, { useEffect, useState } from 'react'
import { QrCode } from 'lucide-react'
import QRCode from 'qrcode'
import Image from 'next/image'
import ClipboardJS from 'clipboard'
import { motion } from 'framer-motion'
import { ClipboardIcon } from '@radix-ui/react-icons'
import Layout from '@/components/Layout'

const Billing = () => {
  const [qrCodeDataURL, setQRCodeDataURL] = useState('')
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TRON_ADDRESS === undefined) {
      throw new Error('TRON address is not defined')
    }

    const address = process.env.NEXT_PUBLIC_TRON_ADDRESS

    const generateQR = async (address: string) => {
      try {
        const dataURL = await QRCode.toDataURL(address)
        setQRCodeDataURL(dataURL)
      } catch (err) {
        console.error(err)
      }
    }

    generateQR(address)
  }, [])
  useEffect(() => {
    const clipboard = new ClipboardJS('.tron')
    clipboard.on('success', onCopySuccess)

    return () => {
      clipboard.destroy()
    }
  }, [])

  const onCopySuccess = () => {
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }
  const notificationVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Layout>
      <div className="w-full flex justify-center items-center">
        <div className="container flex flex-col space-y-8 py-6 px-2 sm:py-10 max-w-xl">
          <div>
            <p className="mb-2 hidden font-semibold text-red-900 dark:text-green-400 sm:block">
              支付
            </p>
            <h1 className="ml-4 md:ml-0 text-xl font-bold sm:text-2xl dark:text-neutral-200">
              支付 USDT
            </h1>
          </div>
          <div>
            <div>
              <div className="mb-8 flex flex-col items-center">
                {qrCodeDataURL ? (
                  <>
                    <Image src={qrCodeDataURL} alt="QR Code" width={200} height={200} />
                  </>
                ) : (
                  <div className="h-[144px] w-[144px] animate-pulse rounded-sm bg-slate-200 dark:bg-slate-700"></div>
                )}
                <div className="mt-4 flex space-x-2 rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm dark:border-yellow-700 dark:bg-yellow-950 dark:text-neutral-700">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 shrink-0 text-yellow-500 dark:text-yellow-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  <span>
                    仅在 <span className="font-bold">Tron</span> 网络上充值
                    <span className="font-bold">USDT</span>，否则您的资金将会丢失。
                  </span>
                </div>
              </div>
              <div className="space-y-6 sm:space-y-4  dark:text-white">
                <div className="space-y-1 sm:flex sm:justify-between sm:space-x-6 sm:space-y-0">
                  <div className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                    地址
                  </div>
                  <div
                    data-clipboard-text={process.env.NEXT_PUBLIC_TRON_ADDRESS}
                    className="tron cursor-pointer break-all font-mono transition hover:opacity-50 sm:text-right sm:text-sm flex flex-row gap-1 items-center "
                  >
                    <span className="md:hidden">
                      <ClipboardIcon width={13} height={13} />
                    </span>
                    {process.env.NEXT_PUBLIC_TRON_ADDRESS ? (
                      <div>{process.env.NEXT_PUBLIC_TRON_ADDRESS}</div>
                    ) : (
                      <div className="h-6 w-48 animate-pulse rounded-sm bg-slate-200 dark:bg-slate-700 sm:h-5"></div>
                    )}
                  </div>
                </div>
                <div
                  data-orientation="horizontal"
                  role="none"
                  className="bg-slate-200 dark:bg-slate-700 h-[1px] w-full hidden sm:block"
                ></div>
                <div className="space-y-1 sm:flex sm:justify-between sm:space-x-6 sm:space-y-0">
                  <div className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                    代币
                  </div>
                  <div className="flex items-center space-x-2 font-medium sm:text-sm">
                    <svg
                      viewBox="0 0 48 48"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rounded-full bg-emerald-500 text-white dark:bg-emerald-600 h-5 w-5"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M27.0774 25.9635C26.9055 25.9761 26.0175 26.0281 24.0365 26.0281C22.4609 26.0281 21.3423 25.9818 20.9498 25.9635C14.8608 25.7008 10.316 24.6615 10.316 23.4171C10.316 22.1726 14.8608 21.1347 20.9498 20.8678V24.9283C21.348 24.9564 22.4881 25.0225 24.0637 25.0225C25.9545 25.0225 26.9012 24.9452 27.0717 24.9297V20.8706C33.1478 21.1361 37.6826 22.1754 37.6826 23.4171C37.6826 24.6587 33.1492 25.698 27.0717 25.9621L27.0774 25.9635ZM27.0774 20.4507V16.8171H35.557V11.2762H12.4702V16.8171H20.9484V20.4493C14.0573 20.7597 8.875 22.0982 8.875 23.7022C8.875 25.3062 14.0573 26.6433 20.9484 26.9551V38.5988H27.076V26.9509C33.9513 26.6405 39.125 25.3034 39.125 23.7008C39.125 22.0982 33.9556 20.7611 27.076 20.4493L27.0774 20.4507Z"
                      ></path>
                    </svg>
                    <div>USDC</div>
                  </div>
                </div>
                <div
                  data-orientation="horizontal"
                  role="none"
                  className="bg-slate-200 dark:bg-slate-700 h-[1px] w-full hidden sm:block"
                ></div>
                <div className="space-y-1 sm:flex sm:justify-between sm:space-x-6 sm:space-y-0">
                  <div className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                    网络
                  </div>
                  <div className="flex items-center space-x-2 font-medium sm:text-sm">
                    <svg
                      viewBox="0 0 48 48"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rounded-full bg-red-500 text-white dark:bg-red-600 h-5 w-5"
                    >
                      <path d="M38.8516 19.0375C37.4453 17.739 35.5 15.7562 33.9156 14.35L33.8219 14.2843C33.6659 14.1591 33.49 14.0609 33.3016 13.9937C29.4813 13.2812 11.7016 9.95778 11.3547 9.99997C11.2575 10.0136 11.1646 10.0488 11.0828 10.1031L10.9937 10.1734C10.8841 10.2848 10.8008 10.4193 10.75 10.5672L10.7266 10.6281V10.9609V11.0125C12.7281 16.5859 20.6313 34.8437 22.1875 39.1281C22.2813 39.4187 22.4594 39.9718 22.7922 40H22.8672C23.0453 40 23.8047 38.9968 23.8047 38.9968C23.8047 38.9968 37.3797 22.5343 38.7531 20.7812C38.9309 20.5653 39.0879 20.333 39.2219 20.0875C39.2561 19.8954 39.24 19.6977 39.1751 19.5137C39.1102 19.3297 38.9987 19.1656 38.8516 19.0375ZM27.2875 20.9547L33.0813 16.15L36.4797 19.2812L27.2875 20.9547ZM25.0375 20.6406L15.0625 12.4656L31.2016 15.4422L25.0375 20.6406ZM25.9375 22.7828L36.1469 21.1375L24.475 35.2L25.9375 22.7828ZM13.7078 13.2812L24.2031 22.1875L22.6844 35.2093L13.7078 13.2812Z"></path>
                    </svg>
                    <div>Tron</div>
                  </div>
                </div>
                <div
                  data-orientation="horizontal"
                  role="none"
                  className="bg-slate-200 dark:bg-slate-700 h-[1px] w-full hidden sm:block"
                ></div>
                <div className="space-y-1 sm:flex sm:justify-between sm:space-x-6 sm:space-y-0">
                  <div className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                    最低充值
                  </div>
                  <div className="hidden lg:block">
                    <button data-state="closed">
                      <div className="sm:text-right">
                        <div className="flex items-center space-x-2 font-medium text-red-500 sm:text-sm">
                          <span>≥ 1 USDT</span>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="sm:text-right lg:hidden">
                    <div className="font-medium text-red-500 sm:text-sm">≥ 1 USDT</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 sm:mt-1 sm:max-w-[320px]">
                      不接受低于 1 USDT 的充值，退款可能需要一周
                    </div>
                  </div>
                </div>
                <div
                  data-orientation="horizontal"
                  role="none"
                  className="bg-slate-200 dark:bg-slate-700 h-[1px] w-full hidden sm:block"
                ></div>
                <div className="space-y-1 sm:flex sm:justify-between sm:space-x-6 sm:space-y-0">
                  <div className="whitespace-nowrap text-sm font-medium text-slate-500 dark:text-slate-400">
                    预估时间
                  </div>
                  <div className="font-medium sm:text-sm">30～60 分钟</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                window.location.href = '/gpt4'
              }}
              className="active:scale-95 items-center justify-center text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900 h-11 px-8 rounded-full block flex-1"
            >
              完成
            </button>
          </div>
        </div>
        <div>
          {showNotification && (
            <motion.div
              className="fixed bottom-0 right-0 mb-8 mr-8 bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={notificationVariants}
              transition={{ duration: 0.4 }}
            >
              已复制到剪贴板
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Billing

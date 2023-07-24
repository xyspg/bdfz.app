import React, { useState } from 'react'
import { Logo } from '@/components/intro/Logo'
import Link from 'next/link'
import { motion } from 'framer-motion'

const OnBoarding = () => {
  const [selectedIndex, setSelectedIndex] = useState(1)
  const handleIncreaseIndex = () => {
    setSelectedIndex((prevIndex) => prevIndex + 1)
  }
  const handleDecreaseIndex = () => {
    setSelectedIndex((prevIndex) => prevIndex - 1)
  }

  switch (selectedIndex) {
    case 1:
      return (
        <main className='bg-neutral-100'>
          <motion.div
            initial={{ opacity: 0, x: 150 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col transition-colors duration-200 p-6 min-h-screen place-content-center bg-neutral-100"
          >
            <div className="max-w-md mx-auto">
              <div className="flex justify-center">
                <Logo />
              </div>
              <section className="w-full h-full text-sm flex flex-col justify-center">
                <h1 className="font-styrene-display font-medium text-4xl md:text-5xl text-center mt-20 mb-16">
                  欢迎使用 BDFZ AI
                </h1>
                <div className="mb-4 font-styrene text-center leading-snug">点击开始以继续</div>
              </section>
              <div className="mt-4 gap-2 fzlex flex-row justify-center">
                <button
                  onClick={handleIncreaseIndex}
                  className=" px-10 py-2 font-styrene text-base rounded-2xl bg-black text-white"
                >
                  开始
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      )

    case 2:
      return (
        <div className="flex flex-col transition-colors duration-200 p-6 min-h-screen place-content-center bg-neutral-100">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <Logo />
            </div>
            <section className="w-full h-full text-sm flex flex-col justify-center">
              <h2 className="font-styrene-display font-medium text-xl text-center mt-14 mb-6">
                BDFZ AI 处于开放性 Beta 阶段
              </h2>
            </section>
            <ul className="flex flex-col gap-2 mb-8">
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M192,72H152.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,24,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,151.12,214l11,7.33A16,16,0,0,0,186.5,212l11.77-44.36A48,48,0,0,0,192,72ZM171,207.89l0,.11-11-7.33V168h21.6ZM192,152H160V88h32a32,32,0,1,1,0,64Z"></path>
                  </svg>
                </div>
                <div className="">
                  它可能偶尔会产生不正确或误导性的信息，或者生成冒犯性或有偏见的内容。
                </div>
              </li>
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24ZM84,140a12,12,0,1,1,12-12A12,12,0,0,1,84,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,172,140Z"></path>
                  </svg>
                </div>
                <div className="">
                  如果问题的相关内容没有明确在学校文件中写明，BDFZ AI
                  将无法返回准确的答案。您可尝试换一种提问方式，如“书院活动室”的准确率高于“书活”。
                </div>
              </li>
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM120,104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm8,88a12,12,0,1,1,12-12A12,12,0,0,1,128,192Z"></path>
                  </svg>
                </div>
                <div className="">
                  BDFZ AI
                  不旨在提供专业建议，包括选校、职业规划和专业选择。在没有进行自己的独立调查之前，请不要依赖
                  BDFZ AI。
                </div>
              </li>
            </ul>
            <div className="mt-4 gap-2 flex flex-row justify-between">
              <button
                onClick={handleDecreaseIndex}
                className="px-10 py-2 font-styrene text-base rounded-2xl bg-transparent text-black border border-black"
              >
                返回
              </button>
              <button
                onClick={handleIncreaseIndex}
                className="px-10 py-2 font-styrene text-base rounded-2xl bg-black text-white"
              >
                继续
              </button>
            </div>
          </div>
        </div>
      )

    case 3:
      return (
        <div className="flex flex-col transition-colors duration-200 p-6 min-h-screen place-content-center bg-neutral-100">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <Logo />
            </div>
            <section className="w-full h-full  flex flex-col justify-center">
              <h2 className="font-styrene-display font-medium text-xl text-center mt-14 mb-6">
                我们正在尝试让 BDFZ AI 变得更好
              </h2>
              <ul className="flex flex-col gap-2 mb-8">
                <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-white-100">
                  <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M200,48H136V16a8,8,0,0,0-16,0V48H56A32,32,0,0,0,24,80V192a32,32,0,0,0,32,32H200a32,32,0,0,0,32-32V80A32,32,0,0,0,200,48ZM172,96a12,12,0,1,1-12,12A12,12,0,0,1,172,96ZM96,184H80a16,16,0,0,1,0-32H96ZM84,120a12,12,0,1,1,12-12A12,12,0,0,1,84,120Zm60,64H112V152h32Zm32,0H160V152h16a16,16,0,0,1,0,32Z"></path>
                    </svg>
                  </div>
                  <div className="">请勿将 BDFZ AI 用于生成违法、霸凌或欺骗性内容等有害用途。</div>
                </li>
                <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-white-100">
                  <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm32-84H96V56a32,32,0,0,1,64,0Z"></path>
                    </svg>
                  </div>
                  <div className="">
                    我们定期审查由我们自动滥用检测标记的对话，并可能使用它们来改进我们的安全系统。
                  </div>
                </li>
                <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-white-100">
                  <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 256 256"
                    >
                      <path d="M243.33,90.91,114.92,219.31a16,16,0,0,1-22.63,0l-71.62-72a16,16,0,0,1,0-22.61l24-24a16,16,0,0,1,22.57-.06l36.64,35.27.11.11h0l92.73-91.37a16,16,0,0,1,22.58,0l24,23.56A16,16,0,0,1,243.33,90.91Z"></path>
                    </svg>
                  </div>
                  <div className="">
                    此外，您使用 BDFZ AI 的行为受到我们的
                    <Link
                      className="font-medium underline"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="/policies/terms-of-use"
                    >
                      《服务条款》
                    </Link>{' '}
                    和{' '}
                    <Link
                      className="font-medium underline"
                      rel="noopener noreferrer"
                      target="_blank"
                      href="/policies/privacy"
                    >
                      《隐私政策》
                    </Link>
                    的约束。
                  </div>
                </li>
              </ul>
            </section>
            <div className="mt-4 gap-2 flex flex-row justify-between">
              <button
                onClick={handleDecreaseIndex}
                className="px-10 py-2 font-styrene text-base rounded-2xl bg-transparent text-black border border-black"
              >
                返回
              </button>
              <button
                onClick={handleIncreaseIndex}
                className="px-10 py-2 font-styrene text-base rounded-2xl bg-black text-white"
              >
                继续
              </button>
            </div>
          </div>
        </div>
      )

    case 4:
      return (
        <div className="flex flex-col transition-colors duration-200 p-6 min-h-screen place-content-center bg-neutral-100">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h2 className="font-styrene-display font-medium text-xl text-center mt-8 mb-6">
              BDFZ AI 可能会改变，但不会变质
            </h2>
            <ul className="flex flex-col gap-2 mb-8">
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32Z"></path>
                  </svg>
                </div>
                <div className="">我们可能会根据用户的使用情况，调整使用限制、功能或政策。</div>
              </li>
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24ZM84,140a12,12,0,1,1,12-12A12,12,0,0,1,84,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,128,140Zm44,0a12,12,0,1,1,12-12A12,12,0,0,1,172,140Z"></path>
                  </svg>
                </div>
                <div className="">
                  如果某个回答没有帮助，请点击{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                    className="inline-block -mt-0.5"
                  >
                    <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                  </svg>{' '}
                  来告诉我们
                </div>
              </li>
              <li className="border-solid border border-black rounded-2xl flex items-start gap-4 p-3 font-styrene bg-manilla-100">
                <div className="flex items-center justify-center rounded-full bg-black p-2 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"></path>
                  </svg>
                </div>
                <div className="">
                  请发送邮件至 <a href="mailto:feedback@bdfz.app">feedback@bdfz.app</a>{' '}
                  与我们分享您的想法或建议。
                </div>
              </li>
            </ul>
            <div className="mt-4 gap-2 flex flex-row justify-between">
              <button
                onClick={handleDecreaseIndex}
                className="px-10 py-2 font-styrene text-base rounded-2xl bg-transparent text-black border border-black"
              >
                返回
              </button>
              <Link href="/chat">
                <button className="px-10 py-2 font-styrene text-base rounded-2xl bg-black text-white">
                  完成
                </button>
              </Link>
            </div>
          </div>
        </div>
      )
  }
}

export default OnBoarding
